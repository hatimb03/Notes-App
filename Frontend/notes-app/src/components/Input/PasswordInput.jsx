import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

/* eslint-disable react/prop-types */
const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className='flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3'>
      <input
        value={value}
        placeholder={placeholder || "Password"}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        className='text-sm py-3 bg-transparent mr-3 rounded outline-none w-full'
      />
      {isShowPassword ? (
        <FaRegEye
          size={22}
          className='cursor-pointer text-primary'
          onClick={() => {
            toggleShowPassword();
          }}
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className='cursor-pointer text-slate-400'
          onClick={() => {
            toggleShowPassword();
          }}
        />
      )}
    </div>
  );
};

export default PasswordInput;
