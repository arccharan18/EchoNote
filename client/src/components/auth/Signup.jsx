import "./Auth.scss";
import logo from "../../img/logo.svg";
import { Link, Navigate } from "react-router-dom";
import { signupUser } from "../../store/thunks/user";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useState } from "react";
import isValidEmail from "./isValidEmail";
import Button from "../UI/Button";
import Input from "../UI/Input";

const Signup = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, passwordConfirm } = formData;

    // Basic client-side validation
    if (password !== passwordConfirm) {
      return toast.warn("Passwords do not match");
    } else if (!isValidEmail(email)) {
      return toast.warn("Email is not valid");
    }

    // Disable signup button during request processing
    setLoading(true);

    try {
      // Dispatch signupUser action with form data
      await dispatch(signupUser({ name, email, password, passwordConfirm }));
      toast.success("Signup successful!");
    } catch (error) {
      // Handle signup error
      toast.error("Signup failed. Please try again.");
    } finally {
      // Reset loading state after request completes
      setLoading(false);
    }
  };

  return (
    <>
      {!user.auth ? (
        <div className="auth">
          <form className="auth__form" onSubmit={handleSubmit}>
            <img className="auth__form-logo" src={logo} alt="Spotify logo" />
            <Link to="/login" className="auth__form-link">
              Log In here
            </Link>
            <Input
              name="name"
              type="text"
              placeholder="Name"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <Input
              name="passwordConfirm"
              type="password"
              placeholder="Confirm Password"
              required
              value={formData.passwordConfirm}
              onChange={handleChange}
            />
            <Button type="submit" isLoading={loading}>
              {loading ? "Loading" : "Sign Up"}
            </Button>
          </form>

          <p className="note">
            ☝🏻 Please note that authentication may take a few minutes. As the server spins down a free web service that
            goes 15 minutes without receiving inbound traffic, it takes some time to start.
          </p>
        </div>
      ) : (
        <Navigate to={"/"} />
      )}
    </>
  );
};

export default Signup;
