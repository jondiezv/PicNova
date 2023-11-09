import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validateUsername = (value) => {
    return value.length >= 4;
  };

  const validatePassword = (value) => {
    return value.length >= 8;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!validateEmail(email)) {
      newErrors = {
        ...newErrors,
        email: "Please enter a valid email address.",
      };
    }
    if (!validateUsername(username)) {
      newErrors = {
        ...newErrors,
        username: "Username must be at least 4 characters long.",
      };
    }
    if (!validatePassword(password)) {
      newErrors = {
        ...newErrors,
        password: "Password must be at least 8 characters long.",
      };
    }
    if (password !== confirmPassword) {
      newErrors = {
        ...newErrors,
        confirmPassword: "Please confirm your password matches.",
      };
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const data = await dispatch(signUp(username, email, password));
      if (data) {
        setErrors(data);
      } else {
        closeModal();
      }
    }
  };

  return (
    <div className="login-form">
      <h1 className="login-title">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label className="login-label">
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`login-input ${errors.email ? "input-error" : ""}`}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </label>
        <label className="login-label">
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={`login-input ${errors.username ? "input-error" : ""}`}
          />
          {errors.username && (
            <div className="error-message">{errors.username}</div>
          )}
        </label>
        <label className="login-label">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`login-input ${errors.password ? "input-error" : ""}`}
          />
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
        </label>
        <label className="login-label">
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={`login-input ${
              errors.confirmPassword ? "input-error" : ""
            }`}
          />
          {errors.confirmPassword && (
            <div className="error-message">{errors.confirmPassword}</div>
          )}
        </label>
        <button type="submit" className="login-button">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
