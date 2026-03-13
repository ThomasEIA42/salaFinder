type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  type?: "button" | "submit";
};

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  type = "button",
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-brand-600 text-white border border-brand-700 hover:bg-brand-700",
    secondary: "bg-surface text-text border-border hover:bg-gray-50",
    danger: "bg-surface text-danger-600 border border-red-200 hover:bg-red-50",
  };

  return (
    <button
      type={type}
      className={` ${base} cursor-pointer rounded-btn ${variants[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}