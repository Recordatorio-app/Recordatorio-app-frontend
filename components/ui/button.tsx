import Spinner from "./spiner";

interface ButtonProps {
  children?: React.ReactNode;
  type?: "button" | "submit";
  bg: string;
  textColor: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const Button = ({
  bg,
  children,
  textColor,
  type = "submit",
  onClick,
  loading = false,
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        p-2 rounded-md ${textColor}
        ${bg}
        disabled:opacity-50
        disabled:cursor-not-allowed
        flex items-center justify-center gap-2
      `}
      onClick={onClick}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
};

export default Button;
