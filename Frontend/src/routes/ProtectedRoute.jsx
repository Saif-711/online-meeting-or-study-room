import { Navigate } from "react-router-dom";

function isTokenExpired(token){
  try {
  const payload=JSON.parse(atob(token.split('.')[1]));
  if(!payload.exp)return false;
  const currentTimeSec = Math.floor(Date.now() / 1000);
  return payload.exp < currentTimeSec;
  
} catch (error) {
  return true;
}
}

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token"); 
    return <Navigate to="/login" replace />;
  }

  return children;
}