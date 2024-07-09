import React, { useState } from "react";
import { useSignup } from "../hooks/useSignUp";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isLoading, error } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    signup(email, password);
  };
  return (
    <form onSubmit={handleSubmit} className="signup">
      <h3>Sign Up</h3>

      <label>Email: </label>
      <input
        name='email'
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <label>Password: </label>
      <input
        name='password'
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button disabled={isLoading} name="signup">Sign Up</button>

      {error && <div className="error">{error}</div>}
    </form>
  );
}