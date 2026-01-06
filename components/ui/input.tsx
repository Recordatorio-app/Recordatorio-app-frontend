import React from "react";

interface BaseProps {
  label: string;
  placeholder?: string;
  id: string;
  className?: string;
  value?: string;
  icon?: React.ReactNode;
  error?: string;
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
    className = "bg-white rounded-md p-2 text-xs  w-full focus:outline-none focus:ring-2 focus:ring-one truncate pr-6 ",
    value,
    icon,
  } = props;

  return (
    <div className="flex flex-col w-full gap-1 ">
      <label htmlFor={id} className="text-xs font-medium mt-1">
        {label}
      </label>

      {/* TEXTAREA */}
      {props.as === "textarea" && (
        <>
          <div className="relative w-full">
            <textarea
              id={id}
              placeholder={placeholder}
              onChange={props.onChange}
              value={value}
              className={`${className}`}
            />

            {/* error (con espacio reservado) */}
            <span className="min-h-[4px] text-red-500 text-xs">
              {props.error}
            </span>
          </div>
        </>
      )}

      {/* SELECT */}
      {props.as === "select" && (
        <>
          <div className="relative w-full">
            <select
              id={id}
              onChange={props.onChange}
              className={`${className}`}
            >
              <option value="">Selecciona una opción</option>
              {props.options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  selected={value === opt.value}
                >
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="min-h-[4px] text-red-500 text-xs">
              {props.error}
            </span>
          </div>
        </>
      )}

      {/* INPUT */}
      {(!props.as || props.as === "input") && (
        <>
          {/* input + icon */}
          <div className="relative w-full">
            <input
              id={id}
              type={props.type}
              placeholder={placeholder}
              onChange={props.onChange}
              className={` ${className}`}
              value={value}
            />
            <span className="absolute right-1 top-1/2 -translate-y-1/2">
              {icon}
            </span>
          </div>

          {/* error (con espacio reservado) */}
          <span className="min-h-[4px] text-red-500 text-xs">
            {props.error}
          </span>
        </>
      )}
    </div>
  );
};

export default Input;
