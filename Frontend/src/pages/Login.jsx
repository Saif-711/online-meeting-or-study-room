import {useState,useContext} from "react";
import {login as loginApi} from "../services/AuthService";
import {useNavigate} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login (){

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try{
      const data = await loginApi(email,password);
      console.log("Login response:", data);
      login(data.token);
      console.log("Token stored:", localStorage.getItem("token"));
      navigate("/dashboard");
    }catch(err){
      console.log(err.response);
      const errorMessage = err.response?.data 
        ? (typeof err.response.data === 'string' ? err.response.data : err.response.data.message)
        : err.message;
      setError(errorMessage || "Login failed");
    }finally{
      setLoading(false);
    }
  };
  return (
   <div className="login-container">
    <h2>Login</h2>
    
    <form onSubmit={handleLogin}>
      <div>
        <label>Email:</label>
        <br />
        <input type="email" placeholder="Enter your email" 
        value={email} onChange={(e)=>setEmail(e.target.value)} required/>
      </div>
      <br />
            <div>
        <label>Password:</label>
        <br />
        <input type="password" placeholder="Enter your password" 
        value={password} onChange={(e)=>setPassword(e.target.value)} required/>
      </div>
      <br />
      {error && (
          <p style={{color:"red"}}>{error}</p>
      )
      }
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
   </div>
  );
}

