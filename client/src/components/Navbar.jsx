import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { appContent } from "../contex/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();

  const { userData, backendUrl, setIsLoggedIn, setUserData } =
    useContext(appContent);

  const sendVerificationOtp = async () => {
    try {
        axios.defaults.withCredentials = true;
        const {data} = await axios.post(backendUrl + "/api/auth/send-verify-otp")

        if(data.success){
          navigate("/email-verify");
          toast.success(data.message);
        }else{
          toast.error(data.message)
        }

    } catch (error) {
      toast.error(error.message)
    }
  }



  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");

      data.success && setIsLoggedIn(false);
      data.success && setUserData(false);
      navigate("/")
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container py-5 flex justify-between items-center">
      <div
        onClick={() => navigate("/")}
        className="text-2xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 px-3 py-1 bg-clip-text text-transparent cursor-pointer"
      >
        MERN AUTH
      </div>

      {userData ? (
        <div
          className="w-8 h-8 flex justify-center items-center rounded-full
          bg-black text-white relative group cursor-pointer"
        >
          {userData.user[0].toUpperCase()}
          <div
            className="absolute hidden group-hover:block top-0 right-0
              z-10 text-black rounded pt-10"
          >
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isAccountVirefy && (
                <li onClick={sendVerificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
                  Verify email
                </li>
              )}
              <li onClick={logout}
                              className="py-1 px-2 hover:bg-gray-200
                  cursor-pointer pr-10"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className=" cursor-pointer rounded-md bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 py-1.5 px-5 hover:bg-gray-200 transition-all duration-300">
          <button
            onClick={() => navigate("/login")}
            className="text-xl text-white cursor-pointer"
            to="#"
          >
            Login <FaArrowRight className="inline-block" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
