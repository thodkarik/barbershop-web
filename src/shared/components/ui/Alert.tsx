type Props = {
    variant?: "error" | "info";
    children: React.ReactNode;
};

const Alert = ({ variant = "info", children }: Props) => {
    const styles =
        variant === "error"
            ? "bg-red-50 text-red-700"
            : "bg-gray-50 text-gray-700";

    return <div className={`rounded-lg p-3 text-sm ${styles}`}>{children}</div>;
};

export default Alert;
