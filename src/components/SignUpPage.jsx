import React, { useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth";
import { Button } from "@nextui-org/react";
import ErrorPopup from "./ui/ErrorPopup";
import {
  setUser,
  setAuthStatus,
  setError,
  clearError,
} from "../feature/authSlice.js";
import { useDispatch } from "react-redux";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    gender: "",
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
      const response = await authService.createUser(formData);
      dispatch(setAuthStatus(true))
      if (response.uid) {
        dispatch(setUser(response));
        navigate(`/${response.username}`);
        setIsLoading(false);
      } else {
        dispatch(setError(response));
        setIsErrorPopupOpen(true);
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
          <div className="flex">
            <h1 className="text-4xl font-bold text-orange-500 mb-2">
              Welcome To ChatterBox
            </h1>
            <img className="h-20" src={logo} alt="logo" />
          </div>
          <p className="text-gray-600 mb-6">A way to socialize yourself</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border-gray-300 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-200 text-gray-900"
              onChange={handleChange}
              required
            />
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
            <select
              name="gender"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border-gray-300 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-200 text-gray-900"
              onChange={handleChange}
              required
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <Button
            isLoading={isLoading}
              type="submit"
              size="lg"
              color="primary"
              className="w-full font-bold text-white"
            >
              Sign Up
            </Button>
            {/* <button
            type="submit"
            className="w-full bg-orange-500 text-white rounded-lg px-4 py-3 font-bold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-colors"
          >
            Sign Up
          </button> */}
          </form>
          {/* <button
          onClick={() => navigate("/login")}
          className="w-full mt-4 text-orange-500 font-semibold hover:text-orange-600 focus:outline-none"
        >
          Login
        </button> */}
          <Button
            onClick={() => navigate("/login")}
            color="primary"
            variant="light"
            className="mt-2 w-full font-semibold"
          >
            Login
          </Button>
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-600 text-center">#beTheChatterBox</p>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
