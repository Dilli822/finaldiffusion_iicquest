import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/context/AuthContext";
import { ChevronLeft, Eye, EyeOff, Fingerprint, Mail } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    role: "",
  });

  const { login, loading } = useAuth();

  const toggleView = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(inputs);
    if (res.success) {
      navigate("/");
    } else {
      console.log(res.error);
    }
  };

  const isDisabled =
    !inputs.email || !inputs.password || !inputs.role || loading;

  return (
    <div className="w-[400px] mx-auto shadow-lg p-8 rounded-md relative">
      <h1 className="text-3xl font-bold text-center mt-2">Welcome back</h1>
      <p className="text-gray-500 mb-6 mt-2 text-center text-sm">
        Please log in to access your account and continue your journey with us.
      </p>
      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="flex items-center gap-2 mt-4">
          <Mail />
          <Input
            type="email"
            name="email"
            placeholder="Enter your Email"
            value={inputs.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center gap-2 mt-4 relative">
          <Fingerprint />
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your Password"
            value={inputs.password}
            onChange={handleChange}
            required
          />
          <span
            onClick={toggleView}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </span>
        </div>

        {/* Role */}
        <div className="flex items-center gap-8 mt-4">
          <Label htmlFor="role">Role:</Label>
          <RadioGroup
            name="role"
            value={inputs.role}
            onValueChange={(value) =>
              setInputs((prev) => ({ ...prev, role: value }))
            }
            className="flex items-center gap-5"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="creator" id="creator" />
              <Label htmlFor="creator">Creator</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="recruiter" id="recruiter" />
              <Label htmlFor="recruiter">Recruiter</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Submit Button */}
        <Button disabled={isDisabled} className="w-full mt-8" type="submit">
          {loading ? <HashLoader size={20} color="white" /> : "Login"}
        </Button>
      </form>

      {/* Forgot password link */}
      <Link to="/auth/forgot-password">
        <p className="text-sm hover:underline cursor-pointer text-center mt-2">
          Forgot password?
        </p>
      </Link>

      {/* Sign up */}
      <p className="text-sm text-center mt-2">
        Don&apos;t have an account?{" "}
        <Link to="/auth/register">
          <span className="font-semibold hover:underline hover:text-blue-400 cursor-pointer">
            Sign Up
          </span>
        </Link>
      </p>

      {/* Back button */}
      <Button
        variant="outline"
        className="absolute top-2 left-2 p-2 h-auto"
        onClick={() => navigate("/")}
      >
        <ChevronLeft />
      </Button>
    </div>
  );
}

export default Login;
