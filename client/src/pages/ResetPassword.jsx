import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../contex/AppContext";
 

const ResetPassword = () => {

  const navigate = useNavigate();

  const { backendUrl } = useContext(AppContent);

  axios.defaults.withCredentials = true;

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const [otp, setOtp] = useState("");

  const inputRefs = useRef([]);

  // Handle OTP Input
  const handleInput = (e, index) => {

    if (
      e.target.value.length > 0 &&
      index < inputRefs.current.length - 1
    ) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (e, index) => {

    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      index > 0
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle Paste OTP
  const handlePaste = (e) => {

    const pasteData = e.clipboardData.getData("text");

    const pasteArray = pasteData.split("");

    pasteArray.forEach((char, index) => {

      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  // Send OTP
  const onSubmitEmail = async (e) => {

    e.preventDefault();

    try {

      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email }
      );

      if (data.success) {

        toast.success(data.message);

        setIsEmailSent(true);

      } else {

        toast.error(data.message);
      }

    } catch (error) {

      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  // Verify OTP
  const onSubmitOTP = async (e) => {

    e.preventDefault();

    const otpArray = inputRefs.current.map(
      (input) => input.value
    );

    const finalOtp = otpArray.join("");

    setOtp(finalOtp);

    setIsOtpSubmitted(true);
  };

  // Reset Password
  const onSubmitNewPassword = async (e) => {

    e.preventDefault();

    try {

      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        {
          email,
          otp,
          newPassword,
        }
      );

      if (data.success) {

        toast.success(data.message);

        navigate("/login");

      } else {

        toast.error(data.message);
      }

    } catch (error) {

      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  return (

    <div className='min-h-screen w-full bg-[url("./assets/bg_img.png")] bg-cover bg-center'>

      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="container mx-auto pt-5 px-5 cursor-pointer"
      >
        <span className="text-2xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          MERN AUTH
        </span>
      </div>

      {/* Main Container */}
      <div className="flex items-center justify-center min-h-[90vh] px-4">

        {/* EMAIL FORM */}
        {!isEmailSent && (

          <form
            onSubmit={onSubmitEmail}
            className="bg-slate-900/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md text-sm"
          >

            <h1 className="text-white text-3xl font-bold text-center mb-2">
              Reset Password
            </h1>

            <p className="text-center mb-6 text-gray-300">
              Enter your registered email address
            </p>

            <div className="mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-lg bg-[#333A5C]">

              <input
                type="email"
                placeholder="Email Address"
                className="bg-transparent outline-none text-white w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 cursor-pointer hover:opacity-90 transition"
            >
              Send OTP
            </button>

          </form>
        )}

        {/* OTP FORM */}
        {!isOtpSubmitted && isEmailSent && (

          <form
            onSubmit={onSubmitOTP}
            className="bg-slate-900/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md text-sm"
          >

            <h1 className="text-white text-3xl font-bold text-center mb-2">
              Verify OTP
            </h1>

            <p className="text-center mb-6 text-gray-300">
              Enter the 6-digit OTP sent to your email
            </p>

            <div
              className="flex justify-between mb-8 gap-2"
              onPaste={handlePaste}
            >

              {Array(6)
                .fill("")
                .map((_, index) => (

                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    required
                    inputMode="numeric"
                    className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-lg outline-none border border-gray-500 focus:border-indigo-500"
                    ref={(el) => (inputRefs.current[index] = el)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full hover:opacity-90 transition"
            >
              Verify OTP
            </button>

          </form>
        )}

        {/* NEW PASSWORD FORM */}
        {isOtpSubmitted && isEmailSent && (

          <form
            onSubmit={onSubmitNewPassword}
            className="bg-slate-900/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md text-sm"
          >

            {/* Hidden Email Field for Accessibility */}
            <input
              type="email"
              value={email}
              autoComplete="username"
              readOnly
              hidden
            />

            <h1 className="text-white text-3xl font-bold text-center mb-2">
              New Password
            </h1>

            <p className="text-center mb-6 text-gray-300">
              Enter your new password
            </p>

            <div className="mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-lg bg-[#333A5C]">

              <input
                type="password"
                placeholder="New Password"
                className="bg-transparent outline-none text-white w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
              />

            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 cursor-pointer hover:opacity-90 transition"
            >
              Reset Password
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

export default ResetPassword;