import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import axios from "axios";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  Fingerprint,
  Mail,
  User2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const steps = ["User Info", "Interests", "Review"];

const availableTags = [
  "Web Development",
  "UI/UX Design",
  "Machine Learning",
  "Marketing",
  "Blockchain",
  "Mobile Apps",
  "Product Management",
  "Video Editing",
  "Writing",
  "Finance",
];

function Register() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "creator",
    interests: [],
  });

  const next = () => {
    if (step === 0) {
      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.password.trim() ||
        !formData.role.trim()
      ) {
        toast.error("Please fill in all required fields.");
        return;
      }
    }

    // if (step === 1) {
    //   if (formData.interests.length === 0) {
    //     toast.error("Please select at least one interest.");
    //     return;
    //   }

    if (step < steps.length - 1) setStep(step + 1);
  };

  const prev = () => step > 0 && setStep(step - 1);
  const toggleView = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTag = (tag) => {
    const updated = formData.interests.includes(tag)
      ? formData.interests.filter((t) => t !== tag)
      : [...formData.interests, tag];
    setFormData((prev) => ({ ...prev, interests: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== steps.length - 1) return;

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        interests: formData.interests,
      };

      const res = await axios.post(`${API_URL}/auth/register`, payload, {
        withCredentials: true,
      });

      toast.success(res?.data.message || "Registration successful");
      navigate("/auth/login");
    } catch (error) {
      toast.error(error.response?.data.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-gray-300 z-0" />
        <div
          className="absolute top-3.5 left-0 h-0.5 bg-blue-600 z-10 transition-all duration-300"
          style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((label, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-sm font-medium w-full relative z-20"
          >
            <div
              className={`step-circle ${
                index < step ? "completed" : index === step ? "active" : ""
              }`}
            >
              {index < step ? <CheckCircle className="w-5 h-5" /> : index + 1}
            </div>
            <span className="mt-2">{label}</span>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader></CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && (
            <div className="w-[400px] mx-auto px-8 rounded-md relative">
              <h1 className="text-3xl font-bold text-center">Create Account</h1>
              <p className="text-gray-500 mb-6 mt-2 text-center text-sm">
                Join us today! Please fill in your details to create an account.
              </p>

              <form>
                <div className="flex items-center gap-2 mt-4">
                  <User2 />
                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Mail />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex items-center gap-2 mt-4 relative">
                  <Fingerprint />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create your Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <p className="cursor-pointer flex justify-end mr-2 absolute right-0">
                    {showPassword ? (
                      <span onClick={toggleView}>
                        <Eye size={20} />
                      </span>
                    ) : (
                      <span onClick={toggleView}>
                        <EyeOff size={20} />
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-8 mt-4">
                  <Label htmlFor="role">Role :</Label>
                  <RadioGroup
                    name="role"
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, role: value }))
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
              </form>

              <p className="text-sm text-center mt-5">
                Already have an account?{" "}
                <Link to="/auth/login">
                  <span className="font-semibold hover:underline hover:text-blue-400 cursor-pointer">
                    Login
                  </span>
                </Link>
              </p>
              <Button
                className="absolute top-0 left-2"
                onClick={() => navigate("/")}
              >
                <ChevronLeft />
              </Button>
            </div>
          )}

          {step === 1 && (
            <>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Select what you're interested in:
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full border text-sm transition ${
                        formData.interests.includes(tag)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="text-lg space-y-4">
              <p>
                <strong>Name: </strong> {formData.name}
              </p>
              <p>
                <strong>Email: </strong> {formData.email}
              </p>
              <p>
                <strong>Role: </strong> {formData.role}
              </p>
              <p>
                <strong>Interests: </strong>{" "}
                {formData.interests.length
                  ? formData.interests.join(", ")
                  : "None"}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={prev} disabled={step === 0}>
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={next}>Next</Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-500"
              disabled={loading}
            >
              {loading ? <HashLoader size={20} color="white" /> : "Submit"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default Register;
