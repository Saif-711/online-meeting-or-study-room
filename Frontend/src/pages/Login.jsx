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
      login(data.token, data.username);
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
   <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow-lg" style={{maxWidth: '400px', width: '100%'}}>
          <div className="card-body p-5">
              <div className="text-center mb-4">
                  <h2 className="card-title fw-bold text-primary">
                      <i className="bi bi-box-arrow-in-right me-2"></i>Login
                  </h2>
                  <p className="text-muted">Welcome back! Please login to your account.</p>
              </div>
              
              {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                      <button type="button" className="btn-close" onClick={() => setError("")}></button>
                  </div>
              )}
              
              <form onSubmit={handleLogin}>
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
                              placeholder="Enter your email" 
                              value={email} 
                              onChange={(e)=>setEmail(e.target.value)} 
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
                              placeholder="Enter your password" 
                              value={password} 
                              onChange={(e)=>setPassword(e.target.value)} 
                              required
                          />
                      </div>
                  </div>

                  <div className="d-grid gap-2">
                      <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                          {loading ? (
                              <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                  Logging in...
                              </>
                          ) : (
                              <>
                                  <i className="bi bi-box-arrow-in-right me-2"></i>
                                  Login
                              </>
                          )}
                      </button>
                  </div>
              </form>

              <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                      Don't have an account? <a href="/register" className="text-primary text-decoration-none">Register here</a>
                  </p>
              </div>
          </div>
      </div>
   </div>
  );
}

