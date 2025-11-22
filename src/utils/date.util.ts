export const formatDate = (date: Date): string => {
    return date.toISOString();
};

export const formateSecureString = (data: string) => {
    if (data.length <= 4) return data;
    return '*'.repeat(data.length - 4) + data.slice(-4);
};
