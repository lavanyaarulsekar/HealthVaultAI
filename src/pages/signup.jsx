import { Link } from "react-router-dom";
import "./signup.css";

function Signup() {
  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Account creation will be connected to the backend next!");
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
            🛡️
          </div>

          <h1>
            Your health,
            <br />
            <span>securely stored.</span>
          </h1>

          <p>
            Create your personal HealthVault and keep
            your important health information organized
            in one secure place.
          </p>

          <div className="auth-benefits">

            <div>
              <span>✓</span>
              Secure personal account
            </div>

            <div>
              <span>✓</span>
              Easy access to your information
            </div>

            <div>
              <span>✓</span>
              Your data stays under your control
            </div>

          </div>

        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="auth-right">

        <div className="auth-card">

          <div className="auth-header">

            <span className="auth-label">
              GET STARTED
            </span>

            <h2>
              Create your account
            </h2>

            <p>
              Start your secure health journey with HealthVault.
            </p>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="input-group">

              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your full name"
                required
              />

            </div>


            <div className="input-group">

              <label>Email Address</label>

              <input
                type="email"
                placeholder="you@example.com"
                required
              />

            </div>


            <div className="input-group">

              <label>Password</label>

              <input
                type="password"
                placeholder="Create a password"
                required
              />

            </div>


            <div className="input-group">

              <label>Confirm Password</label>

              <input
                type="password"
                placeholder="Confirm your password"
                required
              />

            </div>


            <label className="terms">

              <input type="checkbox" required />

              <span>
                I agree to the HealthVault terms and privacy policy.
              </span>

            </label>


            <button
              className="auth-submit"
              type="submit"
            >
              Create Account
              <span>→</span>
            </button>

          </form>


          <div className="auth-divider">
            <span>OR</span>
          </div>


          <button className="google-btn">
            <span>G</span>
            Continue with Google
          </button>


          <p className="auth-switch">

            Already have an account?

            <Link to="/login">
              Login
            </Link>
            <Link to="/" className="back-home">
              ← Back to Home
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Signup;