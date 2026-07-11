import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthProviders";

function App() {
  return (
     <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;