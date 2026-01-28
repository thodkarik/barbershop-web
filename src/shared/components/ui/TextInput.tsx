type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
};

const TextInput = ({ label, className = "", ...props }: Props) => {
    return (
        <div>
            <label className="text-sm font-medium">{label}</label>
            <input
                className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring ${className}`}
                {...props}
            />
        </div>
    );
};

export default TextInput;
