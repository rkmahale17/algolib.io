import { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';
import env from '@/config/env';
import { addSubmission, updateProgress } from '@/utils/userAlgorithmDataHelpers';
import { Submission } from '@/types/userAlgorithmData';
import { LANGUAGE_IDS } from '@/components/CodeRunner/constants';
import { Language } from '@/components/CodeRunner/LanguageSelector';

const mapStatusStringToId = (status: string): { id: number; description: string } => {
    switch (status.toLowerCase()) {
        case 'accepted': return { id: 3, description: 'Accepted' };
        case 'wrong answer': return { id: 4, description: 'Wrong Answer' };
        case 'time limit exceeded': return { id: 5, description: 'Time Limit Exceeded' };
        case 'compilation error': return { id: 6, description: 'Compilation Error' };
        case 'runtime error': return { id: 7, description: 'Runtime Error' };
        case 'internal error': return { id: 13, description: 'Internal Error' };
        case 'executing': return { id: 2, description: 'Processing' };
        case 'pending': return { id: 1, description: 'In Queue' };
        default: return { id: 3, description: status };
    }
};

const parseErrorLines = (output: string, lang: string): Array<{ line: number; column?: number; message: string }> => {
    if (!output) return [];
    const errors: Array<{ line: number; column?: number; message: string }> = [];
    const lines = output.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let match;

        if (lang === 'python') {
            match = line.match(/File ".*", line (\d+)/);
            if (match) {
                const lineNum = parseInt(match[1]);
                let message = line;
                if (i + 1 < lines.length) {
                    message += '\n' + lines[i + 1];
                    if (i + 2 < lines.length) message += '\n' + lines[i + 2];
                }
                errors.push({ line: lineNum, message: message.trim() });
            } else if (line.includes('Error:') || line.includes('Exception:')) {
                errors.push({ line: 1, message: line });
            }
        } else if (lang === 'java' || lang === 'cpp') {
            match = line.match(/(?::| )(\d+)[: ](?:(\d+)[: ])?\s*(error|warning|fatal error):(.*)/i);
            if (match) {
                errors.push({
                    line: parseInt(match[1]),
                    column: match[2] ? parseInt(match[2]) : undefined,
                    message: match[4]?.trim() || line
                });
            }
        }
    }
    return errors;
};

interface UseCodeExecutionProps {
    algorithmId?: string; // problemId in future generic version
    activeAlgorithm: any;
    code: string;
    language: Language;
    testCases: Array<{ id: number; input: any[]; expectedOutput: any; isCustom: boolean; description?: string; isSubmission?: boolean }>;
    setExecutedTestCases: (cases: any[]) => void;
    editorRef: React.RefObject<any>;
    setActiveTab: (tab: "testcase" | "result" | "submissions") => void;
    setSubmissions: React.Dispatch<React.SetStateAction<Submission[]>>;
    posthog: any;
    isLimitExceeded?: boolean;
    onRunStart?: () => void;
    onSuccess?: () => void;
}

export const useCodeExecution = ({
    algorithmId,
    activeAlgorithm,
    code,
    language,
    testCases,
    setExecutedTestCases,
    editorRef,
    setActiveTab,
    setSubmissions,
    posthog,
    isLimitExceeded,
    onRunStart,
    onSuccess
}: UseCodeExecutionProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [output, setOutput] = useState<any | null>(null);
    const [executionTime, setExecutionTime] = useState<number | null>(null);
    const [lastRunSuccess, setLastRunSuccess] = useState(false);

    const waitForSubmissionResult = (submissionId: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                supabase?.removeChannel(channel);
                reject(new Error("Execution timeout. Please try again or check submissions history."));
            }, 30000); // 30 seconds timeout

            const channel = supabase!
                .channel(`submission-${submissionId}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'submissions',
                        filter: `id=eq.${submissionId}`,
                    },
                    (payload) => {
                        const { status } = payload.new as any;
                        if (status && status !== 'pending' && status !== 'executing') {
                            clearTimeout(timeout);
                            supabase?.removeChannel(channel);

                            const result = {
                                ...payload.new as any,
                                status: mapStatusStringToId(status)
                            };
                            resolve(result);
                        }
                    }
                )
                .subscribe();
        });
    };

    const executeCode = async (isSubmission: boolean = false) => {
        if (isLimitExceeded) {
            toast.error("Daily execution limit exceeded! Please try again in sometime.");
            return { result: { stderr: "Limit exceeded" }, allPassed: false, execTime: 0 };
        }

        if (isSubmission) setIsSubmitting(true);
        else setIsLoading(true);

        setOutput(null);
        setExecutionTime(null);
        editorRef.current?.setErrors([]);

        const casesToRun = isSubmission
            ? testCases
            : testCases.filter(tc => !tc.isSubmission);

        setExecutedTestCases(casesToRun);

        try {
            const startTime = performance.now();
            const algo = activeAlgorithm;
            let fullCode = code;

            const preparedTestCases = casesToRun.map((tc: any) => ({
                input: tc.input,
                expectedOutput: tc.expectedOutput ?? tc.output,
                description: tc.isCustom ? 'Custom Case' : `Case ${tc.id + 1}`
            }));

            if (algo && preparedTestCases.length > 0) {
                const metadata = typeof algo.metadata === 'string'
                    ? JSON.parse(algo.metadata)
                    : (algo.metadata || {});

                if (metadata.class_mode) {
                    const { generateClassTestRunner } = await import('@/utils/testRunnerGenerator');
                    fullCode = generateClassTestRunner(code, language, preparedTestCases);
                } else {
                    const { generateTestRunner } = await import('@/utils/testRunnerGenerator');
                    const entryFunctionName = algo.function_name || algo.metadata?.function_name;
                    const inputSchema = algo.input_schema || [];
                    const inplaceFieldIndex = inputSchema.findIndex((field: any) => field.inplace === true || String(field.inplace) === 'true');
                    const hasInplaceField = inplaceFieldIndex !== -1;

                    fullCode = generateTestRunner(
                        code,
                        language,
                        preparedTestCases,
                        inputSchema,
                        entryFunctionName,
                        {
                            unordered: metadata.unordered || algo.unordered,
                            multiExpected: metadata.multi_expected || algo.multi_expected,
                            returnModifiedInput: hasInplaceField || metadata.return_modified_input === true || String(metadata.return_modified_input) === 'true' || metadata.inplace === true || String(metadata.inplace) === 'true' || algo.return_modified_input === true || String(algo.return_modified_input) === 'true',
                            modifiedInputIndex: hasInplaceField ? inplaceFieldIndex : (metadata.modified_input_index !== undefined ? Number(metadata.modified_input_index) : (algo.modified_input_index !== undefined ? Number(algo.modified_input_index) : 0))
                        }
                    );
                }
            }

            const { data: { session } } = await supabase.auth.getSession();
            const response = await axios.post(`${env.apiUrl}/api/execute`, {
                language_id: LANGUAGE_IDS[language],
                source_code: fullCode,
                stdin: "",
                problem_id: algorithmId,
                compiler_options: language === 'typescript' ? "--target ES2020 --downlevelIteration" : undefined
            }, {
                headers: {
                    Authorization: `Bearer ${session?.access_token}`
                }
            });

            const { submission_id } = response.data;
            if (!submission_id) throw new Error("No submission_id received from server");

            const result = await waitForSubmissionResult(submission_id);
            const execTime = Math.round(performance.now() - startTime);
            setExecutionTime(execTime);

            if (result.stdout && !result.stderr && !result.compile_output) {
                try {
                    const startMarker = '___TEST_RESULTS_START___';
                    const endMarker = '___TEST_RESULTS_END___';
                    const startIdx = result.stdout.indexOf(startMarker);
                    const endIdx = result.stdout.indexOf(endMarker);
                    let parsedResults = [];

                    if (startIdx !== -1 && endIdx !== -1) {
                        const jsonStr = result.stdout.substring(startIdx + startMarker.length, endIdx).trim();
                        parsedResults = JSON.parse(jsonStr);
                    } else {
                        const lines = result.stdout.split('\n');
                        let jsonStr = '';
                        let inJson = false;
                        let bracketCount = 0;
                        for (const line of lines) {
                            const trimmed = line.trim();
                            if (!inJson && trimmed.startsWith('[')) { inJson = true; bracketCount = 0; }
                            if (inJson) {
                                jsonStr += line;
                                for (const char of line) {
                                    if (char === '[') bracketCount++;
                                    if (char === ']') bracketCount--;
                                }
                                if (bracketCount === 0) break;
                            }
                        }
                        if (jsonStr) parsedResults = JSON.parse(jsonStr);
                    }

                    if (Array.isArray(parsedResults) && parsedResults.length > 0 && Object.keys(parsedResults[parsedResults.length - 1]).length === 0) {
                        parsedResults.pop();
                    }
                    result.testResults = parsedResults;
                } catch (e) {
                    console.warn("Failed to parse test results JSON", e);
                }
            }

            setOutput(result);

            if (result.stderr || result.compile_output) {
                const errorText = result.compile_output || result.stderr || "";
                const parsedErrors = parseErrorLines(errorText, language);
                if (parsedErrors.length > 0) {
                    editorRef.current?.setErrors(parsedErrors);
                }
            }

            if (!isSubmission) setActiveTab("result");

            const testResults = result.testResults;
            const allPassed = testResults && Array.isArray(testResults) && testResults.length > 0 && testResults.every((r: any) => r.status === 'pass');
            const hasFailed = testResults && Array.isArray(testResults) && testResults.some((r: any) => r.status !== 'pass');

            if (!isSubmission) {
                setLastRunSuccess(!!(result.status?.id === 3 && allPassed));
            }

            if (result.status?.id === 3 && allPassed) {
                if (!isSubmission) toast.success("All test cases passed!");
            } else if (result.status?.id === 3 && hasFailed) {
                if (!isSubmission) toast.warning("Code ran, but some test cases failed.");
            } else if (result.status?.id !== 3) {
                toast.error("Execution failed");
            } else {
                if (!isSubmission) toast.success("Code executed successfully!");
            }

            if (!isSubmission && posthog) {
                posthog.capture('run_code', {
                    problemId: algorithmId,
                    language: language,
                    status: result.status?.id === 3 ? (allPassed ? 'pass' : 'fail') : 'error',
                    executionTimeMs: execTime
                });
            }

            return { result, allPassed, execTime };
        } catch (err: any) {
            console.error(err);
            const errorMessage = err.response?.data?.error || err.message || "An unexpected error occurred";
            setOutput({ stderr: errorMessage });
            toast.error("Failed to execute code");
            return { result: { stderr: errorMessage }, allPassed: false, execTime: 0 };
        } finally {
            setIsLoading(false);
            setIsSubmitting(false);
        }
    };

    const handleRun = () => {
        onRunStart?.();
        executeCode(false);
    };

    const handleSubmit = async () => {
        if (!algorithmId) return;

        onRunStart?.();
        const { result, allPassed, execTime } = await executeCode(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error("You must be logged in to submit.");
            return;
        }

        const now = new Date().toISOString();
        const submissionId = crypto.randomUUID();

        const testResults = result?.testResults || [];
        const passedCount = testResults.filter((r: any) => r.status === 'pass').length;
        const failedCount = testResults.filter((r: any) => r.status !== 'pass').length;

        const newSubmission: Submission = {
            id: submissionId,
            timestamp: now,
            language: language,
            code: code,
            status: allPassed ? 'passed' : (result?.stderr || result?.compile_output ? 'error' : 'failed'),
            test_results: {
                passed: passedCount,
                failed: failedCount,
                total: testResults.length,
                execution_time_ms: execTime,
                errors: result?.stderr ? [result.stderr] : undefined
            }
        };

        await addSubmission(user.id, algorithmId, newSubmission);
        setSubmissions(prev => [...prev, newSubmission]);
        setActiveTab("submissions");

        if (allPassed) {
            const confetti = (await import('canvas-confetti')).default;
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            toast.success("Solution Submitted Successfully!");
            onSuccess?.();
            await updateProgress(user.id, algorithmId, {
                completed: true,
                completed_at: now
            });
        } else {
            toast.error("Submission Failed. Check the results.");
        }

        if (posthog) {
            posthog.capture('submit_code', {
                problemId: algorithmId,
                language: language,
                status: allPassed ? 'pass' : (result?.status?.id === 3 ? 'fail' : 'error'),
                executionTimeMs: execTime
            });
        }
    };

    return {
        isLoading,
        isSubmitting,
        output,
        setOutput,
        executionTime,
        lastRunSuccess,
        setLastRunSuccess,
        handleRun,
        handleSubmit
    };
};
