type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "danger" | "ghost";
};

const Button = ({ variant = "primary", className = "", ...props }: Props) => {
    const base =
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed";

    const variants: Record<NonNullable<Props["variant"]>, string> = {
        primary: "bg-black text-white hover:opacity-90",
        danger: "bg-red-600 text-white hover:opacity-90",
        ghost: "bg-transparent text-black hover:bg-gray-100",
    };

    return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
};

export default Button;
