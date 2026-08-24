import { useState } from "react";
import { register } from "../services/AuthService";
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
    <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="card shadow-lg" style={{maxWidth: '450px', width: '100%'}}>
            <div className="card-body p-5">
                <div className="text-center mb-4">
                    <h2 className="card-title fw-bold text-primary">
                        <i className="bi bi-person-plus me-2"></i>Register
                    </h2>
                    <p className="text-muted">Create your account to get started</p>
                </div>

                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError("")}></button>
                    </div>
                )}

                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="bi bi-person"></i>
                            </span>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="username"
                                name="username"
                                placeholder="Enter Username"
                                value={formData.username} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="bi bi-envelope"></i>
                            </span>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="email"
                                name="email"
                                placeholder="Enter Email"
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="bi bi-lock"></i>
                            </span>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="password"
                                name="password"
                                placeholder="Enter Password"
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Registering...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-person-plus me-2"></i>
                                    Register
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-muted mb-0">
                        Already have an account? <a href="/login" className="text-primary text-decoration-none">Login here</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
}