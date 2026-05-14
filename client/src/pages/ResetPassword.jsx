import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appContent } from "../contex/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();

  const { backendUrl } = useContext(appContent);
  axios.defaults.withCredentials = true;

  const [email, setEmail] = useState();
  const [newPassword, setNewPassword] = useState();
  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, setotp] = useState(0);
  const [isotpSubmited, setisOtpSubmited] = useState(false);

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    setotp(otpArray.join(""));
    setisOtpSubmited(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        { email, otp, newPassword }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='h-screen w-screen bg-[url("./assets/bg_img.png")] bg-cover bg-center'>
       <div
        onClick={() => navigate("/")}
        className="container text-2xl pt-5 font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 px-3 py-1 bg-clip-text text-transparent cursor-pointer"
      >
        MERN AUTH
      </div>
    <div className="flex items-center justify-center min-h-[90vh]  ">
      

      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-1g shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered email address
          </p>
          <div
            className="mb-4 flex items-center gap-3 w-full px-5 py-2.5
          rounded-full bg-[#333A5C]"
          >
            <input
              type="email"
              placeholder="Email id"
              className="bg-transparent outline-none text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full py-2.5 bg-gradient-to-r from-indigo-500
        to-indigo-900 text-white rounded-full mt-3 cursor-pointer"
          >
            Submit
          </button>
        </form>
      )}

      {!isotpSubmited && isEmailSent && (
        <form
          onSubmit={onSubmitOTP}
          className="bg-slate-900 p-8 rounded-1g shadow-1g w-96 text-sm"
        >
          <h1 className="text-white text-2xl Font-semibold text-center mb-4">
            Reset Password OTP
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the 6-digit code sent to your email id.
          </p>
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handlKeyDown(e, index)}
                />
              ))}
          </div>
          <button
            className="w-full py-3 bg-gradient-to-r from-indigo-500
          to-indigo-900 text-white rounded-full"
          >
            Submit
          </button>
        </form>
      )}

      {isotpSubmited && isEmailSent && (
        <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-1g shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your new password
          </p>
          <div
            className="mb-4 flex items-center gap-3 w-full px-5 py-2.5
          rounded-full bg-[#333A5C]"
          >
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none text-white"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full py-2.5 bg-gradient-to-r from-indigo-500
        to-indigo-900 text-white rounded-full mt-3 cursor-pointer"
          >
            Submit
          </button>
        </form>
      )}
    </div>
    </div>
  );
};

export default ResetPassword;
