import { createContext, useContext, useState, useEffect } from "react";
import { getAuthenticatedUser, login } from "../api/endpoints";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState(() => {
        // Restaurar auth state do localStorage ao inicializar
        try {
            const savedAuth = localStorage.getItem('auth');
            return savedAuth && savedAuth !== 'undefined' ? JSON.parse(savedAuth) : false;
        } catch (e) {
            localStorage.removeItem('auth');
            return false;
        }
    });
    const [user, setUser] = useState(() => {
        // Restaurar username do localStorage ao inicializar
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser && savedUser !== 'undefined' ? JSON.parse(savedUser) : null;
        } catch (e) {
            localStorage.removeItem('user');
            return null;
        }
    });
    const [authloading, setAuthLoading] = useState(true);
    const navigate = useNavigate();

    const checkAuthentication = async () => {
        try {
            const userData = await getAuthenticatedUser();
            setAuth(true);
            setUser(userData.username);
            localStorage.setItem('auth', JSON.stringify(true));
            localStorage.setItem('user', JSON.stringify(userData.username));
        } catch (error) {
            setAuth(false);
            setUser(null);
            localStorage.setItem('auth', JSON.stringify(false));
            localStorage.removeItem('user');
        } finally {
            setAuthLoading(false);
        }
    }

    const authLogin = async (username, password) => {
        const data = await login(username, password);
               if (data.success) {
                    setAuth(true);
                    setUser(username);
                    localStorage.setItem('auth', JSON.stringify(true));
                    localStorage.setItem('user', JSON.stringify(username));
                    navigate(`/${username}`);
               } else {
                    alert("Login failed, invalid username or password");
               }
    }

    const authLogout = () => {
        setAuth(false);
        setUser(null);
        localStorage.removeItem('auth');
        localStorage.removeItem('user');
        navigate('/login');
    }

    useEffect(() => {
        checkAuthentication();
    }, []);

    return (
        <AuthContext.Provider value={{ auth, user, authloading, authLogin, authLogout }}>
            {children}
        </AuthContext.Provider> 
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;
