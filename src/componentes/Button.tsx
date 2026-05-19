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
  const variants = {
    primary: "btn-component btn-component--primary",
    secondary: "btn-component btn-component--secondary",
    danger: "btn-component btn-component--danger",
  };

  return (
    <button
      type={type}
      className={variants[variant]}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
