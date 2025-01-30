import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../../style/signup.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function SignUp() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (!data.username || !data.password) {
      setError("Both fields are required!");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const results = await response.json();
      if (results.success) {
        navigate("/login");
      }
    } catch (error) {
      return <p>Failed to send data: {error}</p>;
    }
  };
  return (
    <>
      <div className="body">
        <div className="signup-container">
          <h2>Sign Up</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="input-container-signup">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" required />
            </div>
            <div className="input-container-signup">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit" className="submit-button-signup">
              Sign Up
            </button>
            <Link to='/login' className="redirectLink">Log in</Link>
          </form>
        </div>
      </div>
    </>
  );
}