import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth";
import { Button } from "@nextui-org/react";
import ErrorPopup from "./ui/ErrorPopup.jsx";
import {
  setUser,
  setAuthStatus,
  setError,
  clearError,
} from "../feature/authSlice.js";
import { useDispatch } from "react-redux";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(clearError());
    try {
      const response = await authService.loginUser(formData);
      dispatch(setAuthStatus(true))

      if (response.uid) {
        dispatch(setUser(response));
        navigate(`/${response.username}`);
        setIsLoading(false);
      } else {

        dispatch(setError(response));
        setIsErrorPopupOpen(true)
      }
    } catch (error) {
      dispatch(setError(error));
    }
    setIsLoading(false);
  };

  return (
    <>
      <ErrorPopup
        isOpen={isErrorPopupOpen}
        onClose={() => setIsErrorPopupOpen(false)}
      />
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-md w-full m-5 md:m-0">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-orange-500 mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600 mb-6">
            Log in to ChatterBox and start chatting
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border-gray-300 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-200 text-gray-900"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border-gray-300 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-200 text-gray-900"
              onChange={handleChange}
              required
            />
            {/* Not adding this functionality for now but it can me made in future */}
            {/* <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-orange-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-orange-500 hover:underline">
              Forgot password?
            </a>
          </div> */}
            {/* <button
            type="submit"
            className="w-full bg-orange-500 text-white rounded-lg px-4 py-3 font-bold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-colors"
          >
            Log In
          </button> */}
            <Button
              isLoading={isLoading}
              type="submit"
              size="lg"
              color="primary"
              className="w-full font-bold text-white"
            >
              Login
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                onClick={() => navigate("/")}
                className="text-orange-500 font-semibold hover:underline cursor-pointer"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-600 text-center">#beTheChatterBox</p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
