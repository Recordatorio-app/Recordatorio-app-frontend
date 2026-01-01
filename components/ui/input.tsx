import React from "react";

interface BaseProps {
  label: string;
  placeholder?: string;
  id: string;
  className?: string;
  value?: string;
}

/* INPUT */
type InputFieldProps = BaseProps & {
  as?: "input";
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

/* TEXTAREA */
type TextareaFieldProps = BaseProps & {
  as: "textarea";
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

/* SELECT */
type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = BaseProps & {
  as: "select";
  options: SelectOption[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

type InputProps = InputFieldProps | TextareaFieldProps | SelectFieldProps;

const Input = (props: InputProps) => {
  const {
    label,
    placeholder,
    id,
    className = "bg-white rounded-md p-2 text-xs w-full focus:outline-none focus:ring-2 focus:ring-one",
    value,
  } = props;

  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={id} className="text-xs font-medium">
        {label}
      </label>

      {/* TEXTAREA */}
      {props.as === "textarea" && (
        <textarea
          id={id}
          placeholder={placeholder}
          onChange={props.onChange}
          value={value}
          className={`${className}`}
        />
      )}

      {/* SELECT */}
      {props.as === "select" && (
        <select id={id} onChange={props.onChange} className={`${className}`}>
          <option value="">Selecciona una opción</option>
          {props.options.map((opt) => (
            <option key={opt.value} value={opt.value} selected={value === opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {/* INPUT */}
      {(!props.as || props.as === "input") && (
        <input
          id={id}
          type={props.type}
          placeholder={placeholder}
          onChange={props.onChange}
          className={` ${className}`}
          value={value}
        />
      )}
    </div>
  );
};

export default Input;
