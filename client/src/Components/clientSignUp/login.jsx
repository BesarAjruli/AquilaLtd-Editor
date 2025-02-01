import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../../style/signup.css';
import Loading from '../../Components/Loading';


const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function LogIn(){
    const [error, setError] = useState("");
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        const formData = new FormData(event.target)
        const data = Object.fromEntries(formData.entries())

        try{
           const resposne = await fetch(`${backendUrl}/api/login`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
            credentials: 'include',
           })
           const results = await resposne.json()
           setLoading(false)
           if(results.success){
            navigate(results.redirect)
           }
        }catch(err){
          setLoading(false)
            console.log(err)
            setError(err)
        }
    }

    //Have used the same stylesheet as signup
    return (
        <>
              {loading && <Loading/>}
          <div className="body">
            <div className="signup-container">
              <h2>Login</h2>
              {error && <p className="error-message">{JSON.stringify(error)}</p>}
                <form onSubmit={handleSubmit}>
                <div className="input-container-signup">
                  <label htmlFor="username">Email</label>
                  <input type="email" id="username" name="username" required />
                </div>
                <div className="input-container-signup">
                  <label htmlFor="password">Password</label>
                  <input type="password" id="password" name="password" required />
                </div>
                <button type="submit" className="submit-button-signup">
                   Login
                </button>
                <Link to='/signup' className="redirectLink">Sign Up</Link>
              </form>
            </div>
          </div>
        </>
      );
}