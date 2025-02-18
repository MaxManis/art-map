import { useContext, useState } from "react";
import { httpClient } from "../../api/httpClient";
import { GlobalStateContext } from "../../context/GlobalStateContext";

export const SignUp = ({ switchSignForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { state, dispatch } = useContext(GlobalStateContext);
  const { token } = state;

  const signUp = async () => {
    try {
      const authBody = {
        email: username,
        password,
      };
      const data = await httpClient.post("/sign_up", token, authBody);
      dispatch({ type: "SET_TOKEN", payload: data.token });
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>Sign Up</h2>

        {error && <p className="error-message">{error}</p>}
        <div>
          <div className="form-group">
            <label htmlFor="email"></label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password2">Password</label>
            <input
              type="password"
              id="password2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="invite-code">Invite Code</label>
            <input
              type="text"
              id="invite-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <button onClick={signUp} type="submit" className="signin-button">
            Sign In
          </button>
        </div>
        <p className="signup-link">
          Already have an account? <span onClick={switchSignForm}>Sign In</span>
        </p>
      </div>
    </div>
  );
};
