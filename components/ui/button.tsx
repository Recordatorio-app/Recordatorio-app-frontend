interface ButtonProps {
  children?: React.ReactNode;
  type?: "button" | "submit";
  bg: string;
  textColor: string;
  onClick?: () => void;
}

const Button = ({
  bg,
  children,
  textColor,
  type = "submit",
  onClick,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`${bg} ${textColor} p-2 rounded-md`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
