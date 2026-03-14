import React, { useState } from "react";
import { Link } from "react-router-dom";

type Props = {
  onLogin: (usuario: string) => void;
};

function Login({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email || !password) return;

    onLogin(email);
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  return (
    <div>
      <h1>Log In</h1>
      <p>Welcome to Sala Finder</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="aaaa@domain.com"
          value={email}
          onChange={handleEmailChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />

        <button type="submit">Submit</button>
      </form>

      <p>
        Don't have an account? <Link to="/signup">Create One</Link>
      </p>
    </div>
  );
}

export default Login;