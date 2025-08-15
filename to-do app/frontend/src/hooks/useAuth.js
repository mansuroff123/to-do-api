import {useState} from "react";
import api from "../api/client";

export function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (username, password) => {
        setLoading(true); setError(null);
        try {
            const { data } = await api.post("/api/auth/token/", { username, password });
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            return true;
        } catch(e) {
            setError('Login failed.'); return false;
        } finally {
            setLoading(false);
        }
    }

    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
    }

    return { login, logout, loading, error };
}