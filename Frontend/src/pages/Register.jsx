import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
export default function Register() {
    const navigate = useNavigate();
   const [formData,setFormData]=useState({
        username:"",
        email:"",
        password:""
   })
    const[error,setError] = useState("");
    const[loading,setLoading] = useState(false);

    const handleChange = (e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });
    };
    
    const handleRegister = async(e)=>{
        e.preventDefault();
        setLoading(true);
        setError("");
        try{
            const data = await register(formData);
            console.log(data);
            navigate("/login");
        }catch(err){
            setError(err.response?.data?.message || "Registration failed");
        }finally{
            setLoading(false);  
        }
    };

return (
    <div className="register-container">
       <div>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
            <div>
                <label>Username:</label>
                <br />
                <input type="text" name="username"placeholder="Enter Username"
                value={formData.username} onChange={handleChange} required />
            </div>
            <br />
            <div>
                <label>Email:</label>
                <br />
                <input type="email" name="email" placeholder="Enter Email"
                value={formData.email} onChange={handleChange} required />
            </div>
            <br />
            <div>
                <label>Password:</label>
                <br />
                <input type="password" name="password" placeholder="Enter Password"
                value={formData.password} onChange={handleChange} required />
            </div>
            <br />
            {error && (
                <p style={{color:"red"}}>{error}</p>
            )}
            <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
            </button>
        </form>
        </div>
    </div>
  );
}
    
       
       
  