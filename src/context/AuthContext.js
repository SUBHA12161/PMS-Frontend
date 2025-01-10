import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/auth");
    }, [navigate]);

    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 < Date.now();
        } catch (error) {
            console.error("Failed to decode token", error);
            return true;
        }
    };

    const fetchUserProfile = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (token) {
            if (isTokenExpired(token)) {
                console.warn("Token has expired. Logging out...");
                logout();
                return;
            }

            try {
                const response = await api.get("/users/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
                localStorage.setItem("user", JSON.stringify(response.data));
            } catch (error) {
                console.error("Failed to fetch user profile", error);
                logout();
            }
        }
    }, [logout]);

    useEffect(() => {
        if (!user) {
            fetchUserProfile();
        }
    }, [user, fetchUserProfile]);

    const login = async (email, password) => {
        try {
            const response = await api.post("/users/login", { email, password });

            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                await fetchUserProfile();
                navigate("/");
            }
        } catch (error) {
            console.error("Login failed", error.response?.data?.message || error.message);
            throw error;
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const response = await api.post("/users/register", {
                name,
                email,
                password,
                role,
            });

            if (response.status === 200) {
                navigate("/");
            }
        } catch (error) {
            console.error("Registration failed", error.response?.data?.message || error.message);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, isTokenExpired }}>
            {children}
        </AuthContext.Provider>
    );
};