export const getStatusColor = (statusId?: number, testResults?: any[]) => {
    if (statusId === 3) {
        const allPassed = testResults?.every((r: any) => r.status === 'pass');
        return allPassed ? "text-green-500" : "text-red-500";
    }
    if (statusId === 6) return "text-red-600 dark:text-red-400"; // Compilation Error
    return "text-red-500"; // Runtime Error or Wrong Answer
};

export const getStatusText = (statusId?: number, description?: string, testResults?: any[]) => {
    if (statusId === 3) {
        const allPassed = testResults?.every((r: any) => r.status === 'pass');
        return allPassed ? "Accepted" : "Wrong Answer";
    }
    return description || "Error";
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
};
