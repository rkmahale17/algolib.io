import { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';
import env from '@/config/env';
import { addSubmission, updateProgress } from '@/utils/userAlgorithmDataHelpers';
import { Submission } from '@/types/userAlgorithmData';
import { LANGUAGE_IDS } from '@/components/CodeRunner/constants';
import { Language } from '@/components/CodeRunner/LanguageSelector';
import { trackEvent } from '@/lib/analytics';

/**
 * Calls the run-reference Edge Function to execute the problem's "optimize" reference
 * solution and returns that solution's execution time in ms.
 *
 * Returns null if:
 * - The algorithm has no optimize code for this language
 * - The reference code fails / times out (TLE, Runtime Error, etc.)
 * - Any network or server error occurs
 *
 * Per design requirements, a null result means we do NOT record a relative_score —
 * the submission is still saved normally, just without normalization data.
 */
async function fetchReferenceTimeMs(
    algorithmId: string,
    language: string,
    accessToken: string
): Promise<number | null> {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
            || process.env.NEXT_PUBLIC_VITE_SUPABASE_URL
            || '';
        const fnUrl = `${supabaseUrl}/functions/v1/run-reference`;

        const res = await fetch(fnUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ algorithm_id: algorithmId, language }),
        });

        if (!res.ok) return null;
        const data = await res.json();
        return typeof data?.ref_time_ms === 'number' ? data.ref_time_ms : null;
    } catch (err) {
        // Network error or edge function unavailable — silently skip
        console.warn('[useCodeExecution] run-reference call failed:', err);
        return null;
    }
}

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

const parseSqlAsciiTable = (rawText: string) => {
    if (!rawText || typeof rawText !== 'string') return null;
    const lines = rawText.trim().split('\n');
    if (lines.length < 3) return null;
    const separatorIndex = lines.findIndex(line => /^[-\+\| ]+$/.test(line) && line.includes('-') && !line.match(/[a-zA-Z0-9]/));
    if (separatorIndex < 1) return null;
    return lines.slice(separatorIndex + 1).filter(line => line.includes('|')).map(line => line.split('|').map(cell => cell.trim()));
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
    onSubmissionComplete?: () => void;
    onSubmissionStart?: () => void;
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
    onSuccess,
    onSubmissionComplete,
    onSubmissionStart
}: UseCodeExecutionProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [output, setOutput] = useState<any | null>(null);
    const [executionTime, setExecutionTime] = useState<number | null>(null);
    const [memoryUsage, setMemoryUsage] = useState<number | null>(null);
    const [lastRunSuccess, setLastRunSuccess] = useState(false);

    const waitForSubmissionResult = (submissionId: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            let isResolved = false;

            const cleanup = () => {
                isResolved = true;
                clearTimeout(timeoutId);
                supabase?.removeChannel(channel);
            };

            const handleResult = (data: any) => {
                if (isResolved) return;
                const { status } = data;
                if (status && status !== 'pending' && status !== 'executing') {
                    cleanup();
                    const result = {
                        ...data,
                        status: mapStatusStringToId(status)
                    };
                    resolve(result);
                }
            };

            const timeoutId = setTimeout(() => {
                if (!isResolved) {
                    cleanup();
                    reject(new Error("Execution timeout. Please try again or check submissions history."));
                }
            }, 12000); // 12 seconds timeout

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
                        handleResult(payload.new);
                    }
                )
                .subscribe(async (status) => {
                    if (status === 'SUBSCRIBED') {
                        const { data, error } = await supabase
                            .from('submissions')
                            .select('*')
                            .eq('id', submissionId)
                            .maybeSingle();
                        
                        if (data && !error) {
                            handleResult(data);
                        }
                    }
                });
        });
    };

    const executeCode = async (isSubmission: boolean = false) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error("Sign in required", {
                description: "Please log in to run or submit code solutions."
            });
            return { result: { stderr: "Authentication required" }, allPassed: false, execTime: 0 };
        }

        if (isLimitExceeded) {
            toast.error("Daily execution limit exceeded! Please try again in sometime.");
            return { result: { stderr: "Limit exceeded" }, allPassed: false, execTime: 0 };
        }

        if (isSubmission) setIsSubmitting(true);
        else setIsLoading(true);

        setOutput(null);
        setExecutionTime(null);
        setMemoryUsage(null);
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
                if (language === 'sql') {
                    const metadata = typeof algo.metadata === 'string' ? JSON.parse(algo.metadata) : (algo.metadata || {});
                    const { data: { session } } = await supabase.auth.getSession();
                    
                    const sqlPromises = preparedTestCases.map(async (tc: any) => {
                        let script = `.bail on\n.headers on\n.mode list\n.separator '|_|_|'\n.nullvalue '___NULL___'\n`;
                        const cleanDbSetup = metadata.db_setup 
                            ? metadata.db_setup
                                .replace(/<br\s*\/?>/gi, '\n')
                                .replace(/&nbsp;/g, ' ')
                                .replace(/\bAUTO_INCREMENT\b/gi, '')
                                .replace(/\bAUTOINCREMENT\b/gi, '')
                            : '';
                        script += cleanDbSetup ? `${cleanDbSetup}\n\n` : '';
                        
                        algo.input_schema?.forEach((field: any, i: number) => {
                            const tableName = field.name.replace(/ table/i, '').trim();
                            const rows = tc.input[i];
                            let dataToInsert: any[] = [];
                            if (Array.isArray(rows)) {
                                dataToInsert = rows;
                            } else if (rows && typeof rows === 'object') {
                                const vals = Object.values(rows);
                                if (vals.length > 0 && Array.isArray(vals[0])) dataToInsert = vals[0] as any[];
                            } else if (rows !== undefined && rows !== null) {
                                dataToInsert = [{ [tableName]: rows }];
                            }
                            
                            if (dataToInsert.length > 0 && typeof dataToInsert[0] === 'object' && dataToInsert[0] !== null) {
                                const columns = Object.keys(dataToInsert[0]);
                                dataToInsert.forEach((row: any) => {
                                    const values = columns.map(col => {
                                        const val = row[col];
                                        if (val === null || val === undefined) return 'NULL';
                                        if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                                        return val;
                                    });
                                    script += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
                                });
                                script += '\n';
                            }
                        });
                        
                        script += code;
                        
                        const response = await axios.post(`${env.apiUrl}/api/execute`, {
                            language_id: LANGUAGE_IDS[language],
                            source_code: script,
                            stdin: "",
                            problem_id: algorithmId,
                        }, { headers: { Authorization: `Bearer ${session?.access_token}` } });
                        
                        const result = await waitForSubmissionResult(response.data.submission_id);
                        
                        const actualStr = result.stdout ? result.stdout.replace(/\(\d+\s+rows?\)\s*$/, '').trim() : '';
                        let passed = false;
                        let expectedData = null;
                        try {
                            expectedData = typeof tc.expectedOutput === 'string' ? JSON.parse(tc.expectedOutput) : tc.expectedOutput;
                        } catch {
                            expectedData = tc.expectedOutput;
                        }
                        
                        let parsedActual: any = actualStr;

                        if (actualStr && tc.expectedOutput !== undefined) {
                            try {
                                const lines = actualStr.split('\n').map(l => l.trim()).filter(l => l);
                                if (lines.length > 0) {
                                    const headers = lines[0].split('|_|_|');
                                    parsedActual = lines.slice(1).map(line => {
                                        const values = line.split('|_|_|');
                                        const obj: any = {};
                                        headers.forEach((h, idx) => {
                                            const val = values[idx];
                                            obj[h] = val === '___NULL___' ? null : val;
                                        });
                                        return obj;
                                    });
                                } else {
                                    parsedActual = [];
                                }

                                if (Array.isArray(parsedActual) && Array.isArray(expectedData)) {
                                    if (parsedActual.length === expectedData.length) {
                                        passed = parsedActual.every((actRow, i) => {
                                            const expRow = expectedData[i];
                                            if (!expRow || typeof expRow !== 'object') return false;
                                            
                                            // Check if both objects have the exact same keys
                                            const actKeys = Object.keys(actRow);
                                            const expKeys = Object.keys(expRow);
                                            
                                            if (actKeys.length !== expKeys.length) return false;
                                            
                                            // Check if all expected keys exist in actual and have matching values
                                            return expKeys.every(k => {
                                                if (!actKeys.includes(k)) return false;
                                                const aVal = actRow[k] === null ? 'null' : String(actRow[k]);
                                                const eVal = expRow[k] === null ? 'null' : String(expRow[k]);
                                                return aVal === eVal;
                                            });
                                        });
                                    }
                                } else {
                                    passed = actualStr === JSON.stringify(expectedData);
                                }
                            } catch (e) {
                                passed = actualStr === JSON.stringify(expectedData);
                            }
                        } else {
                            passed = actualStr === JSON.stringify(expectedData) || !expectedData;
                        }

                        return {
                            status: passed ? (result.stderr ? 'fail' : 'pass') : 'fail',
                            input: tc.input || 'SQL Query',
                            expected: expectedData,
                            actual: parsedActual,
                            error: result.stderr || result.compile_output,
                            time: result.time ? Math.round(parseFloat(result.time) * 1000) : 0,
                            logs: []
                        };
                    });
                    
                    const testCaseResults = await Promise.all(sqlPromises);
                    const allPassed = testCaseResults.every((r: any) => r.status === 'pass');
                    const totalTime = testCaseResults.reduce((acc: number, r: any) => acc + r.time, 0);
                    
                    const finalResult = { testResults: testCaseResults, status: { id: allPassed ? 3 : 4 } };
                    setOutput(finalResult);
                    setExecutionTime(totalTime);
                    
                    if (!isSubmission) {
                        setLastRunSuccess(allPassed);
                        setActiveTab("result");
                        if (allPassed) toast.success("All test cases passed!");
                        else toast.warning("Code ran, but some test cases failed.");
                    }
                    
                    setIsLoading(false);
                    setIsSubmitting(false);
                    
                    return { result: finalResult, allPassed, execTime: totalTime };
                } else {
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
            
            // Priority: strictly use Judge0 provided time.
            // Do NOT fall back to performance.now() as that measures network latency (e.g. 5000ms+) rather than code execution time.
            const execTime = result.time ? Math.round(parseFloat(result.time) * 1000) : undefined;
            
            setExecutionTime(execTime ?? null);
            if (result.memory) {
                setMemoryUsage(result.memory);
            }

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
                trackEvent(posthog, 'run_code', {
                    problemId: algorithmId,
                    language: language,
                    status: result.status?.id === 3 ? (allPassed ? 'pass' : 'fail') : 'error',
                    executionTimeMs: execTime
                });
            }

            return { result, allPassed, execTime, memoryUsage: result.memory };
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

        onSubmissionStart?.();
        const { result, allPassed, execTime, memoryUsage: finalMemory } = await executeCode(true);

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
                memory_usage_kb: finalMemory || undefined,
                errors: result?.stderr ? [result.stderr] : undefined
            }
        };

        if (algorithmId !== 'preview-mode') {
            await addSubmission(user.id, algorithmId, newSubmission);

            // Insert into submission_performance for cross-user distribution tracking.
            // We use a known UUID so we can update it later with the relative_score.
            try {
                const perfRowId = crypto.randomUUID();
                const { error: perfInsertError } = await supabase.from('submission_performance').insert({
                    id: perfRowId,
                    user_id: user.id,
                    algorithm_id: algorithmId,
                    language: language,
                    status: newSubmission.status,
                    execution_time_ms: newSubmission.test_results?.execution_time_ms ?? null,
                    memory_usage_kb: newSubmission.test_results?.memory_usage_kb ?? null,
                    // relative_score starts as null; filled in asynchronously below
                });

                if (!perfInsertError && allPassed && execTime && execTime > 0) {
                    // Fire-and-forget: compute relative_score after submission is saved.
                    // This MUST NOT block the user-facing submission flow.
                    // If the reference code fails for any reason, relative_score stays null
                    // and this submission simply won't appear in the normalized distribution.
                    const { data: { session } } = await supabase.auth.getSession();
                    const accessToken = session?.access_token;

                    if (accessToken) {
                        fetchReferenceTimeMs(algorithmId, language, accessToken)
                            .then(async (refTimeMs) => {
                                // refTimeMs is null when reference code failed — skip update
                                if (refTimeMs === null || refTimeMs <= 0) {
                                    console.info('[useCodeExecution] Reference code unavailable or failed; relative_score not recorded.');
                                    return;
                                }

                                const relativeScore = Math.round((execTime / refTimeMs) * 10000) / 10000; // 4 decimal places

                                const { error: updateError } = await supabase
                                    .from('submission_performance')
                                    .update({
                                        relative_score: relativeScore,
                                        ref_execution_time_ms: refTimeMs,
                                    })
                                    .eq('id', perfRowId);

                                if (updateError) {
                                    console.warn('[useCodeExecution] Failed to update relative_score:', updateError);
                                }
                            })
                            .catch((err) => {
                                // Should never reach here (fetchReferenceTimeMs catches internally)
                                console.warn('[useCodeExecution] Unexpected error in relative score update:', err);
                            });
                    }
                }
            } catch (perfError) {
                // Non-blocking: don't fail the submission if perf tracking fails
                console.warn('Failed to record submission performance:', perfError);
            }
        }
        
        setSubmissions(prev => [newSubmission, ...prev]);
        onSubmissionComplete?.();
        setActiveTab("result");

        if (allPassed) {
            toast.success("Solution Submitted Successfully!");
            onSuccess?.();
            if (algorithmId !== 'preview-mode') {
                await updateProgress(user.id, algorithmId, {
                    completed: true,
                    completed_at: now
                });
            }
        } else {
            toast.error("Submission Failed. Check the results.");
        }

        if (posthog) {
            trackEvent(posthog, 'submit_code', {
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
        memoryUsage,
        lastRunSuccess,
        setLastRunSuccess,
        handleRun,
        handleSubmit
    };
};
