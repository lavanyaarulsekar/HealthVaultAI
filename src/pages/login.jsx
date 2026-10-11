import { Link } from "react-router-dom";
import "./login.css";

function Login() {

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Login will be connected to the backend next!");
  };

  return (
    <div className="auth-page">

      {/* LEFT SIDE */}
      <div className="auth-left">

        <Link to="/" className="brand auth-brand">

          <div className="brand-icon">
            🛡️
          </div>

          <span>
            Health<span>Vault</span>
          </span>

        </Link>


        <div className="auth-message">

          <div className="auth-shield">
            +
          </div>

          <h1>
            Welcome back
            <br />
            to your <span>Vault.</span>
          </h1>

          <p>
            Access your health information securely
            and keep everything important in one place.
          </p>

        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="auth-right">
        

        <div className="auth-card">

          <div className="auth-header">

            <span className="auth-label">
              WELCOME BACK
            </span>

            <h2>
              Login to HealthVault
            </h2>

            <p>
              Enter your credentials to access your account.
            </p>

          </div>


          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit}>

            <div className="input-group">

              <label>
                Email Address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                required
              />

            </div>


            <div className="input-group">

              <div className="password-label">

                <label>
                  Password
                </label>

                <a href="#forgot">
                  Forgot password?
                </a>

              </div>

              <input
                type="password"
                placeholder="Enter your password"
                required
              />

            </div>


            <label className="remember">

              <input type="checkbox" />

              <span>
                Remember me
              </span>

            </label>


            <button
              className="auth-submit"
              type="submit"
            >
              Login
              <span>→</span>
            </button>

          </form>


          {/* DIVIDER */}
          <div className="auth-divider">
            <span>OR</span>
          </div>


          {/* GOOGLE BUTTON */}
          <button
            className="google-btn"
            type="button"
          >
            <span>G</span>
            Continue with Google
          </button>


          {/* SIGNUP LINK */}
          <p className="auth-switch">

            Don't have an account?

            <Link to="/signup">
              Create one
            </Link>

          </p>
          <Link to="/" className="back-home">
             ← Back to Home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;