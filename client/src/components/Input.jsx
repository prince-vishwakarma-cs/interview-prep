import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full mb-4">
      {label && (
        <label className="text-sm text-secondary-color-alpha">{label}</label>
      )}
      <div className="w-full flex items-center gap-3 rounded-lg text-sm sm:text-base bg-gray-50/50 px-5 py-3 mt-1 border border-input-border focus-within:border-primary transition-colors">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type === "password" && showPassword ? "text" : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-primary-text "
        />

        {type === "password" && (
          <div onClick={toggleShowPassword} className="cursor-pointer">
            {showPassword ? (
              <FaRegEye size={18} className="text-slate-400" />
            ) : (
              <FaRegEyeSlash size={18} className="text-slate-400" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
