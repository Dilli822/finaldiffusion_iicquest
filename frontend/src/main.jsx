import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
// import { ClerkProvider } from '@clerk/clerk-react'

// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
// if (!PUBLISHABLE_KEY) {
//   throw new Error("Missing Publishable Key");
// }

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      {/* <ClerkProvider publishableKey={PUBLISHABLE_KEY}> */}
      <App />
      {/* </ClerkProvider> */}
      <Toaster richColors closeButton duration={2000} />
    </AuthProvider>
  </StrictMode>
);
