import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../../style/signup.css';
import Loading from '../../Components/Loading';


const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function SignUp() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true)
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (!data.username || !data.password) {
      setError("Both fields are required!");
      setLoading(false)
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const results = await response.json();
      setLoading(false)
      if (results.success) {
        navigate("/login");
      }
    } catch (error) {
      setLoading(false)
      return <p>Failed to send data: {error}</p>;
    }
  };
  return (
    <>
          {loading && <Loading/>}
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