import {useState} from "react";
import {login} from "../services/authService";
import {useNavigate} from "react-router-dom";
export default function Login (){

  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try{
      const data = await login(email,password);
      localStorage.setItem("token",data.token);
      // console.log(data);
      // console.log("Login successful");
      navigate("/dashboard");
   
      
      
    }catch(err){
      console.log(err.response);
      setError(err.response.data.message || "Login failed");
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

