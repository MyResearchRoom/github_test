import React, { useRef } from "react";

const ClickableInputBox = ({
  label,
  placeholder,
  name,
  value,
  onChange,
  list,
  handleEnter,
  handleRemoveText,
}) => {
  const inputRef = useRef(null);
  return (
    <div className=" text-[14px] lg:text-[16px]  space-y-1 ">
      <p className="font-bold w-[100%] truncate">
        {label}:{" "}
        <span className="text-sm font-medium ">(Press Enter to add)</span>
      </p>
      <div
        onClick={() => inputRef.current?.focus()}
        className="  border  bg-white rounded-lg h-[120px]  relative flex flex-col justify-between  border-[#E7E1E1] focus:border focus:border-zinc-400"
      >
        <input
          type="text"
          ref={inputRef}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          onKeyDown={handleEnter}
          className="px-3 w-[100%] resize-none outline-none  rounded-lg p-2 "
        />

        <div
          className=" w-full px-3 space-y-1 overflow-y-auto "
          style={{ scrollbarWidth: "none" }}
        >
          {list?.length > 0 &&
            list.map((item, ind) => (
              <p
                key={ind}
                className="text-sm font-medium break-words flex gap-2 items-start"
                style={{ wordBreak: "break-all" }}
              >
                {ind + 1}
                {"]"} {item}{" "}
                <span
                  onClick={() => handleRemoveText(name, ind)}
                  className="text-red-500 text-sm cursor-pointer hover:text-red-600"
                >
                  X
                </span>
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ClickableInputBox;
