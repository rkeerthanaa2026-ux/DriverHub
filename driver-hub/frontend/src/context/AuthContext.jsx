import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

// the login tabs use driver / employer / admin; the database uses candidate / employer / admin
export const ROLE_OF = { driver: "candidate", employer: "employer", admin: "admin" };

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // true while we check for an existing session

    // restore the session from the cookie on page load
    useEffect(() => {
        api("/auth/me")
            .then((d) => setUser(d.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    // data: { role: "candidate" | "employer", email, password, ...profile fields }
    const register = async (data) => {
        const d = await api("/auth/register", { method: "POST", body: data });
        setUser(d.user);
        return d.user;
    };

    // tab = "driver" | "employer" | "admin"
    const login = async (tab, email, password) => {
        const d = await api("/auth/login", { method: "POST", body: { tab, email, password } });
        setUser(d.user);
        return d.user;
    };

    const logout = async () => {
        try { await api("/auth/logout", { method: "POST" }); } catch { /* ignore */ }
        setUser(null);
    };

    return <AuthContext.Provider value={{ user, loading, register, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);