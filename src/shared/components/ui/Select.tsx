type Option = {
    value: string | number;
    label: string;
};

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    options: Option[];
    placeholder?: string;
};

const Select = ({ label, options, placeholder = "Select...", className = "", ...props }: Props) => {
    return (
        <div>
            <label className="text-sm font-medium">{label}</label>
            <select
                className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring ${className}`}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((o) => (
                    <option key={String(o.value)} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;
