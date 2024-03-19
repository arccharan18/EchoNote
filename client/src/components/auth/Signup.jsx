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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (password !== passwordConfirm) {
      return toast.warn("Passwords do not match");
    } else if (!isValidEmail(email)) {
      return toast.warn("Email is not valid");
    }

    // Disable signup button during request processing
    setLoading(true);

    try {
      await dispatch(signupUser({ name, email, password }));
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
          <form className="auth__form" onSubmit={handleSignup}>
            <img className="auth__form-logo" src={logo} alt="Spotify logo"/>
            <Link to="/login" className="auth__form-link">
              Log In here
            </Link>
            <Input
              name="name"
              placeholder="Name"
              required={true}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              required={true}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              required={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="password"
              name="passwordConfirm"
              placeholder="Confirm Password"
              required={true}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
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
        <Navigate to={"/"}/>
      )}
    </>
  );
};

export default Signup;
