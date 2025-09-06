import { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const GoogleLoginRedirect = () => {
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setToken(token);
      setUser({ _id: payload.id, email: payload.email, role: payload.role });
      navigate("/dashboard"); // redirect after login
    } else {
      navigate("/login");
    }
  }, [location.search, setUser, setToken, navigate]);

  return <div>Logging in with Google...</div>;
};

export default GoogleLoginRedirect;
