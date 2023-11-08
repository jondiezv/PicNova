import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/session";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [isDemoCredentialsSet, setIsDemoCredentialsSet] = useState(false);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
      closeModal();
    }
  };

  const logInAsDemoUser = async () => {
    setEmail("demo@aa.io");
    setPassword("password");
    setIsDemoCredentialsSet(true);
  };

  useEffect(() => {
    if (isDemoCredentialsSet) {
      handleSubmit();
      setIsDemoCredentialsSet(false);
    }
  }, [isDemoCredentialsSet]);

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Log In</button>
        <button type="button" onClick={logInAsDemoUser}>
          Log in as Demo User
        </button>
      </form>
    </>
  );
}

export default LoginFormModal;
