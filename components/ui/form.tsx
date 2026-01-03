interface FormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  title?: string;
  style?: string;
}

const Form = ({
  children,
  onSubmit,
  title,
  style = "flex flex-col gap-2 pt-10 pb-10 pr-5 pl-5 m-4 bg-four rounded-lg",
}: FormProps) => {
  return (
    <form onSubmit={onSubmit} className={style}>
      {title && <h3 className="text-center text-xl">{title}</h3>}
      {children}
    </form>
  );
};

export default Form;
