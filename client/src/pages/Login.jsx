import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../contex/AppContext";
 

const Login = () => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUserData } =
    useContext(AppContent);

  const [state, setState] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      axios.defaults.withCredentials = true;

      if (state === "sign up") {
        const { data } = await axios.post(
          `${backendUrl}/api/auth/register`,
          {
            name,
            email,
            password,
          }
        );

        if (data.success) {
          setIsLoggedIn(true);

          await getUserData();

          toast.success("Account created successfully");

          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(
          `${backendUrl}/api/auth/login`,
          {
            email,
            password,
          }
        );

        if (data.success) {
          setIsLoggedIn(true);

          await getUserData();

          toast.success("Login successful");

          navigate("/");
        } else {
          toast.error(data.message);
        }
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
        className="container mx-auto pt-5 px-5 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <span className="text-2xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          MERN AUTH
        </span>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center min-h-[90vh] px-4">

        <div className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl text-white w-full max-w-md">

          {/* Heading */}
          <h1 className="text-3xl font-bold text-center mb-2">
            {state === "sign up" ? "Create Account" : "Login"}
          </h1>

          <p className="text-gray-300 text-center mb-6">
            {state === "sign up"
              ? "Create your new account"
              : "Login to continue"}
          </p>

          <form onSubmit={onSubmitHandler}>

            {/* Full Name */}
            {state === "sign up" && (
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border border-gray-500 bg-transparent mt-3 w-full rounded-lg px-4 py-3 outline-none focus:border-blue-400"
                placeholder="Full Name"
                type="text"
                name="fullName"
                id="fullName"
                autoComplete="name"
                required
              />
            )}

            {/* Email */}
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="border border-gray-500 bg-transparent mt-4 w-full rounded-lg px-4 py-3 outline-none focus:border-blue-400"
              placeholder="Email Address"
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              required
            />

            {/* Password */}
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="border border-gray-500 bg-transparent mt-4 w-full rounded-lg px-4 py-3 outline-none focus:border-blue-400"
              placeholder="Password"
              type="password"
              name="password"
              id="password"
              autoComplete={
                state === "sign up"
                  ? "new-password"
                  : "current-password"
              }
              required
            />

            {/* Forgot Password */}
            {state === "login" && (
              <div className="text-right mt-3">
                <button
                  type="button"
                  onClick={() => navigate("/reset-password")}
                  className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 py-3 text-lg font-semibold cursor-pointer rounded-full w-full mt-6 hover:opacity-90 transition duration-300"
            >
              {state === "sign up" ? "Sign Up" : "Login"}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center text-sm">
            {state === "login" ? (
              <p>
                Don't have an account?{" "}
                <span
                  onClick={() => setState("sign up")}
                  className="text-blue-400 cursor-pointer hover:text-blue-300"
                >
                  Sign Up
                </span>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <span
                  onClick={() => setState("login")}
                  className="text-blue-400 cursor-pointer hover:text-blue-300"
                >
                  Login Here
                </span>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;