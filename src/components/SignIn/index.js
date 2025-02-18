import { useContext, useState } from "react";
import { httpClient } from "../../api/httpClient";
import { GlobalStateContext } from "../../context/GlobalStateContext";

export const SignIn = ({ switchSignForm }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { state, dispatch } = useContext(GlobalStateContext);
  const { token } = state;

  const signIn = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const authBody = {
        email: username,
        password,
      };
      const data = await httpClient.post("/sign_in", token, authBody);

      dispatch({ type: "SET_TOKEN", payload: data.token });
    } catch (err) {
      console.error(err);
      setError(err.message);
      dispatch({ type: "SET_TOKEN", payload: null });
    }
    dispatch({ type: "SET_LOADING", payload: false });
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>Sign In</h2>

        {error && <p className="error-message">{error}</p>}
        <div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <button onClick={signIn} type="submit" className="signin-button">
            Sign In
          </button>
        </div>
        <p className="signup-link">
          Don't have an account? <span onClick={switchSignForm}>Sign Up</span>
        </p>
      </div>
    </div>
  );
};
