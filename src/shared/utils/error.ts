import axios from "axios";

type ValidationErrors = Record<string, string[]>;

type ProblemDetails = {
    title?: string;
    message?: string;
    detail?: string;
    errors?: ValidationErrors;
};

const isObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null;

export const getErrorMessage = (
    err: unknown,
    fallback = "An unexpected error occurred"
): string => {
    if (!axios.isAxiosError(err)) {
        if (err instanceof Error && err.message) return err.message;
        return fallback;
    }

    const status = err.response?.status;

    if (status === 401) return "Invalid username or password";
    if (status === 403) return "You are not allowed to perform this action";

    const data = err.response?.data;

    if (typeof data === "string") return data;

    if (isObject(data)) {
        const pd = data as ProblemDetails;

        if (typeof pd.message === "string" && pd.message.trim()) return pd.message;
        if (typeof pd.title === "string" && pd.title.trim()) return pd.title;
        if (typeof pd.detail === "string" && pd.detail.trim()) return pd.detail;

        if (pd.errors && typeof pd.errors === "object") {
            const all = Object.values(pd.errors).flat();
            if (all.length > 0) return all.join(", ");
        }
    }

    if (err.message) return err.message;

    return fallback;
};
