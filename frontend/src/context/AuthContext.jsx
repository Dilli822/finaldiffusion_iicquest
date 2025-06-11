// import socket from "@/lib/socket";
// import axios from "axios";
// import { createContext, useContext, useState } from "react";
// import { toast } from "sonner";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user")) || null
//   );

//   const [loading, setLoading] = useState(false);

//   const login = async (inputs) => {
//     setLoading(true);

//     try {
//       const res = await axios.post(`${API_URL}/auth/login`, inputs, {
//         withCredentials: true,
//       });
//       console.log('api-->',res)
//       setUser(res?.data.user);
//       console.log("login-->",res.data.user)
//       localStorage.setItem("user", JSON.stringify(res?.data.user));
//       toast.success(res?.data?.message || "Logged in Succesfully");
//       return { success: true, data: res.data };
//     } catch (error) {
//       console.error("Login error:", error.response?.data || error.message);
//       toast.error(error?.response?.data.message || "Failed to login!");
//       return {
//         success: false,
//         error: error?.response?.data?.message || "Failed to login",
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       if (user?._id) {
//         socket.emit("userOffline", user._id);
//       }
//       const res = await axios.post(
//         `${API_URL}/auth/logout`,
//         {},
//         { withCredentials: true }
//       );
//       setUser(null);
//       localStorage.removeItem("user");
//       toast.success(res?.data.message || "Logged out succesfully");
//       return res;
//     } catch (error) {
//       if (user?._id) {
//         socket.emit("userOffline", user._id);
//       }
//       console.error("Logout error:", error);
//       setUser(null);
//       localStorage.removeItem("user");
//       toast.success(error?.response?.data.message || "Failed to logout!");
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
// export const useAuth = () => useContext(AuthContext);

// src/context/AuthContext.js

import socket from "@/lib/socket";
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie"; // <- Add this

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(false);

  // ✅ Handle socket onlineUsers after login
  useEffect(() => {
    if (!user?._id) return;

    // Emit userOnline to server
    socket.emit("userOnline", user._id);

    // Listen to online users list
    const handleOnlineUsers = (onlineUsers) => {
      console.log("Online users:", onlineUsers);

      // ✅ Store in cookies
      Cookies.set("onlineUsers", JSON.stringify(onlineUsers), {
        path: "/",
        sameSite: "Lax",
      });
    };

    socket.on("onlineUsers", handleOnlineUsers);

    // Cleanup
    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, [user]);

  const login = async (inputs) => {
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/auth/login`, inputs, {
        withCredentials: true,
      });
      console.log("api-->", res);
      setUser(res?.data.user);
      localStorage.setItem("user", JSON.stringify(res?.data.user));
      localStorage.setItem("username", res?.data.user.name);
      toast.success(res?.data?.message || "Logged in Succesfully");
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error(error?.response?.data.message || "Failed to login!");
      return {
        success: false,
        error: error?.response?.data?.message || "Failed to login",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (user?._id) {
        socket.emit("userOffline", user._id);
      }
      const res = await axios.post(
        `${API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("username");

      // ✅ Optional: clear the cookie on logout
      Cookies.remove("onlineUsers");

      toast.success(res?.data.message || "Logged out succesfully");
      return res;
    } catch (error) {
      if (user?._id) {
        socket.emit("userOffline", user._id);
      }
      console.error("Logout error:", error);
      setUser(null);
      localStorage.removeItem("user");

      Cookies.remove("onlineUsers");

      toast.success(error?.response?.data.message || "Failed to logout!");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
