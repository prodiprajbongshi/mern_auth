import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { appContent } from "../contex/AppContext";

const Login = () => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(appContent);

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      if (state === "sign up") {
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className='h-screen w-screen bg-[url("./assets/bg_img.png")] bg-cover bg-center'>
      <div className="container  pt-5 cursor-pointer" onClick={() => navigate("/")}>
        <span className="text-2xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          MERN AUTH
        </span>
      </div>

      <div className="flex items-center justify-center min-h-[90vh]">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-white min-w-90 md:min-w-96">
          {state === "sign up" ? (
            <h1 className="text-2xl font-bold text-white text-center">
              Create Account
            </h1>
          ) : (
            <h1 className="text-2xl font-bold text-white text-center">Login</h1>
          )}
          <form onSubmit={onSubmitHandler}>
            {state === "sign up" && (
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border-2 border-white mt-4 w-full rounded-md px-2 py-2"
                placeholder="Full Name"
                type="text"
                name="fullName"
                id="fullName"
              />
            )}
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="border-2 border-white mt-4 w-full rounded-md px-2 py-2"
              placeholder="Email"
              type="email"
              name="userEmail"
              id="userEmail"
            />
            <br />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="border-2 border-white mt-4 w-full rounded-md px-2 py-2"
              placeholder="Password"
              type="password"
              name="password"
              id="passworrd"
            />
            {state === "login" && (
              <input
                className="text-blue-300 my-4  cursor-pointer"
                onClick={() => navigate("/reset-password")}
                type="button"
                value="Forgot Password"
              />
            )}
            <br />
            {state === "login" ? (
              <input
                className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-400 py-2 text-xl font-bold cursor-pointer  rounded-full w-full "
                type="submit"
                value="Login"
              />
            ) : (
              <input
                className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-400 py-2  text-xl font-bold cursor-pointer rounded-full w-full mt-5"
                type="submit"
                value="Sign Up"
              />
            )}
          </form>
          <div className="">
            {state === "login" ? (
              <p className="my-4 text-sm">
                Don't hav an account?{" "}
                <span
                  onClick={() => setState("sign up")}
                  className="text-blue-400 cursor-pointer"
                >
                  Sign Up
                </span>
              </p>
            ) : (
              <p className="my-4 text-sm">
                Already have an Account?{" "}
                <span
                  onClick={() => setState("login")}
                  className="text-blue-400 cursor-pointer"
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
