import React from "react";

const InputField = ({
  label,
  placeholder,
  name,
  value,
  onChange,
  type = "",
  required,
  className,
  width,
  readOnly = false,
  onClick,
  min,
  max,
  onKeyDown,
  onWheel,
  inputClassName,
  blockStyle,
  inputStyle,
  icon
}) => {
  return (
    <div className={`flex md:flex-row flex-col md:justify-between md:items-center w-[100%] ${className}`} style={blockStyle}>
      <label
        className="md:w-[40%]  font-medium lg:text-base text-sm md:mb-0 mb-1 flex items-center"
        style={{ width: width }}
      >
       {icon && <span className="text-sm mr-2">{icon}</span> } {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        min={min}
        max={max}
        onClick={onClick}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        onKeyDown={onKeyDown}
        onWheel={onWheel}
        className={`outline-none border p-2 md:w-[50%] rounded-md bg-[#F6F6F7] border-[#E7E1E1] focus:border focus:border-zinc-400 ${type === "number" && 'appearance-none'} ${inputClassName}`}
        style={inputStyle}
      />
    </div>
  );
};

export default InputField;
