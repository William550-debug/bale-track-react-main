import { useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../api/userApi.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";

export default function AuthForm({ setShowLogin }) {
  const [authMode, setAuthMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });



  const { loginFunction } = useContext(AuthContext);
  const navigate = useNavigate();

  // Unified form handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: () =>
      login({ email: formData.email, password: formData.password }),
    onSuccess: (data) => {
      if (data?.token) {
        loginFunction(data.token, data.user);
 // Ensure isAuthenticated is set to true
        toast.success("Login successful!");
        setTimeout(() => {
          setShowLogin(false);
          navigate("/");
        }, 500); // Small delay to allow toast to show
      }
    },
    onError: (error) => {
      console.error("Login Failed", error);
      alert(error.response?.data?.message || "Login failed");
    },
  });

  // Signup Mutation
  const signupMutation = useMutation({
    mutationFn: () => signup(formData),
    onSuccess: () => {
      alert("Signup successful! Please login.");
      setAuthMode("login");

      setFormData({ ...formData, password: "" }); // Clear password only
    },
    onError: (error) => {
      console.error("Signup Failed", error);

      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((msg) => toast.error(msg)); // ✅ Show each validation error
      } else {
        toast.error(error.message || "Signup failed");
      }
    },
  });

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Submitting:", formData);

    if (authMode === "login") {
      loginMutation.mutate();
    } else {
      signupMutation.mutate();
    }
  };

  // Toggle between login/signup
  const toggleAuthMode = () => {
    setAuthMode((prev) => (prev === "login" ? "signup" : "login"));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white text-gray-500 max-w-[350px] mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        {authMode === "login" ? "Login" : "Sign Up"}
      </h2>

      {authMode === "signup" && (
        <input
          name="name"
          className="w-full border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
          onChange={handleChange}
          type="text"
          placeholder="Enter your username"
          value={formData.name}
          required
        />
      )}

      <input
        name="email"
        className="w-full border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
        type="email"
        onChange={handleChange}
        placeholder="Enter your email"
        value={formData.email}
        required
      />

      <input
        name="password"
        className="w-full border mt-1 border-gray-500/30 outline-none rounded-full py-2.5 px-4 "
        type="password"
        onChange={handleChange}
        placeholder="Enter your password"
        value={formData.password}
        required
        minLength={8}
      />

      {authMode === "login" && (
        <div className="text-right py-4">
          <a className="text-blue-600 underline" href="#">
            Forgot Password?
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={
          authMode === "login"
            ? loginMutation.isPending
            : signupMutation.isPending
        }
        className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600/90 active:scale-95 transition py-2.5 rounded-full text-white disabled:opacity-70 mt-5"
      >
        {authMode === "login"
          ? loginMutation.isPending
            ? "Logging in..."
            : "Login"
          : signupMutation.isPending
          ? "Creating account..."
          : "Sign Up"}
      </button>

      <p className="text-center mt-4">
        {authMode === "login"
          ? "Don't have an account? "
          : "Already have an account? "}

        <span
          className="text-blue-500 underline cursor-pointer"
          onClick={toggleAuthMode}
        >
          {authMode === "login" ? "Sign Up" : "Login"}
        </span>
      </p>
    </form>
  );
}
