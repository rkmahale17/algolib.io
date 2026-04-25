import { useState } from 'react';
import { toast } from 'sonner';

export const useTestCases = () => {
    const [testCases, setTestCases] = useState<Array<{ id: number; input: any[]; expectedOutput: any; isCustom: boolean; description?: string; isSubmission?: boolean }>>([]);
    const [executedTestCases, setExecutedTestCases] = useState<Array<{ id: number; input: any[]; expectedOutput: any; isCustom: boolean; description?: string; isSubmission?: boolean }>>([]);
    const [activeTab, setActiveTab] = useState<"testcase" | "result" | "submissions">("testcase");
    const [activeTestCaseTab, setActiveTestCaseTab] = useState<string>("");
    const [editingTestCaseId, setEditingTestCaseId] = useState<number | null>(null);
    const [pendingTestCaseId, setPendingTestCaseId] = useState<number | null>(null);
    const [inputValues, setInputValues] = useState<Record<string, string>>({});

    const handleAddTestCase = (activeAlgorithm: any) => {
        const defaultInput = activeAlgorithm?.input_schema?.map((field: any) => {
            switch (field.type) {
                case 'integer': return 0;
                case 'float': return 0.0;
                case 'string': return "";
                case 'boolean': return false;
                case 'array': return [];
                case 'integer[]': return [];
                case 'string[]': return [];
                case 'ListNode[]': return [];
                case 'TreeNode[]': return [];
                case 'object': return {};
                default: return null;
            }
        }) || [];

        const newTestCase = {
            id: Date.now(),
            input: defaultInput,
            expectedOutput: null,
            isCustom: true
        };
        setTestCases([...testCases, newTestCase]);
        setEditingTestCaseId(newTestCase.id);
        setPendingTestCaseId(newTestCase.id);
        setActiveTab("testcase");
    };

    const handleUpdateTestCase = (id: number, updatedCase: any) => {
        setTestCases(testCases.map(tc =>
            tc.id === id ? { ...tc, input: updatedCase.input, expectedOutput: updatedCase.expectedOutput } : tc
        ));
        setEditingTestCaseId(null);
        toast.success("Test case updated");
    };

    const handleDeleteTestCase = (id: number) => {
        setTestCases(testCases.filter(tc => tc.id !== id));
        toast.success("Test case deleted");
    };

    const handleCancelEdit = () => {
        if (editingTestCaseId === pendingTestCaseId) {
            setTestCases(testCases.filter(tc => tc.id !== pendingTestCaseId));
            setPendingTestCaseId(null);
            toast.info("New test case discarded");
        }
        setEditingTestCaseId(null);
    };

    return {
        testCases, setTestCases,
        executedTestCases, setExecutedTestCases,
        activeTab, setActiveTab,
        activeTestCaseTab, setActiveTestCaseTab,
        editingTestCaseId, setEditingTestCaseId,
        pendingTestCaseId, setPendingTestCaseId,
        inputValues, setInputValues,
        handleAddTestCase,
        handleUpdateTestCase,
        handleDeleteTestCase,
        handleCancelEdit
    };
};
