import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { FaEye, FaEyeSlash, FaSignInAlt, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import { login, register } from "../services/UserService";
import { ProductContext } from "../Context/ProductContext";
import Layout from "../Shared/Layout";

const UserLoginPage = () => {
  const { setCartItems, setIsAuthentified, setToken } = useContext(ProductContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emptyInputs = {
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
    confirmpassword: "",
    image: null,
  };

  const [inputs, setInputs] = useState(emptyInputs);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const resetInputs = () => setInputs(emptyInputs);

  // Fix: split into two clearly separated handlers — no more dead code or scoping bugs
  const handleLogin = async () => {
    const { email, password } = inputs;

    if (!email || !password) {
      toast.error("Email and password are required!");
      return;
    }

    const res = await login({ email, password });

    if (!res?.success) {
      // Backend sends a specific message when unverified + resends the email
      toast.error(res?.message || "Login failed!");
      return;
    }

    toast.success(res.message || "Login successful!");

    localStorage.setItem("isAuthentified", "true");
    localStorage.setItem("user", JSON.stringify(res.user));
    setIsAuthentified(true);
    setToken(res.token);
    setCartItems([]);

    navigate("/dashboard");
  };

  const handleRegister = async () => {
    const { firstname, lastname, email, phone, address, password, confirmpassword } = inputs;

    if (!firstname || !lastname || !email || !phone || !address || !password || !confirmpassword) {
      toast.error("Please fill in all required fields!");
      return;
    }

    if (password !== confirmpassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const formData = new FormData();
    Object.entries(inputs).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    const res = await register(formData);

    if (!res?.success) {
      toast.error(res?.message || "Registration failed!");
      return;
    }

    toast.success(res.message || "Check your email to verify your account!");
    resetInputs();
    setIsLogin(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await handleLogin();
      } else {
        await handleRegister();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
        {loading && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-70">
            <div className="flex flex-col items-center">
              <PulseLoader size={12} color="#000" />
              <p className="text-black mt-2 font-semibold">Processing...</p>
            </div>
          </div>
        )}

        <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex">
            <button
              onClick={() => { setIsLogin(true); resetInputs(); }}
              className={`w-1/2 py-4 font-semibold ${isLogin ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); resetInputs(); }}
              className={`w-1/2 py-4 font-semibold ${!isLogin ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
            <div className="flex justify-center mb-6">
              <div className="bg-black text-white p-4 rounded-full">
                {isLogin ? <FaSignInAlt size={32} /> : <FaUser size={32} />}
              </div>
            </div>

            {isLogin ? (
              <>
                <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>

                <input
                  type="email"
                  name="email"
                  value={inputs.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-3 rounded-lg border-2"
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={inputs.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full p-3 pr-10 rounded-lg border-2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <button type="submit" className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800">
                  Login
                </button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

                <input type="text" name="firstname" placeholder="First Name"
                  value={inputs.firstname} onChange={handleChange} className="w-full p-3 rounded-lg border-2" />
                <input type="text" name="lastname" placeholder="Last Name"
                  value={inputs.lastname} onChange={handleChange} className="w-full p-3 rounded-lg border-2" />
                <input type="email" name="email" placeholder="Email"
                  value={inputs.email} onChange={handleChange} className="w-full p-3 rounded-lg border-2" />
                <input type="tel" name="phone" placeholder="Phone"
                  value={inputs.phone} onChange={handleChange} className="w-full p-3 rounded-lg border-2" />
                <input type="text" name="address" placeholder="Address"
                  value={inputs.address} onChange={handleChange} className="w-full p-3 rounded-lg border-2" />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={inputs.password}
                    onChange={handleChange}
                    className="w-full p-3 pr-10 rounded-lg border-2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <input type="password" name="confirmpassword" placeholder="Confirm Password"
                  value={inputs.confirmpassword} onChange={handleChange} className="w-full p-3 rounded-lg border-2" />

                <input type="file" name="image" accept="image/*"
                  onChange={handleChange} className="w-full p-3 rounded-lg border-2" />

                <button type="submit" className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800">
                  Register
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default UserLoginPage;