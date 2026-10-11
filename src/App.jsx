import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import "./index.css";
import Dashboard from "./pages/dashboard";
import HealthProfile from "./pages/healthprofile";
import MedicalRecords from "./pages/medicalrecord";
import Medicines from "./pages/medicine";
import Appointment from "./pages/appoinment";
import Assistant from "./pages/assistant";
import Settings from "./pages/setting";
import HealthTimeline from "./pages/healthtimeline";
import Summarization from "./pages/summarization";
import Emergency from "./pages/emergency";

function Home() {
  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">

        <div className="brand">
          <div className="brand-icon">
            🛡️
          </div>

          <span>
            Health<span>Vault</span>
          </span>
        </div>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </nav>

        <div className="nav-buttons">

          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/signup" className="signup-btn">
            Get Started
          </Link>

        </div>

      </header>


      {/* ================= HERO ================= */}

      <main>

        <section className="hero" id="home">

          <div className="hero-content">

            <div className="hero-badge">
              <span>🔐</span>
              Your health. Your control.
            </div>

            <h1>
              Your Health,
              <br />
              <span>Your Vault.</span>
            </h1>

            <p>
              Securely manage your medical records, medications,
              appointments and essential health information —
              all in one trusted place.
            </p>

            <div className="hero-actions">

              <Link to="/signup" className="primary-btn">
                Get Started
                <span>→</span>
              </Link>

              <a href="/dashboard" className="secondary-btn">
                Explore HealthVault
              </a>

            </div>

            <div className="trust-row">
              <span>✓ Secure & Private</span>
              <span>✓ Easy Access</span>
              <span>✓ You Control Your Data</span>
            </div>

          </div>


          {/* ================= HERO VISUAL ================= */}

          <div className="hero-visual">

            <div className="mint-glow"></div>

            <div className="shield-card">

              <div className="shield-card-top">

                <div className="small-brand-icon">
                  🛡️
                </div>

                <div>
                  <strong>HealthVault</strong>
                  <small>Personal Health</small>
                </div>

              </div>


              <div className="large-shield">

                <div className="medical-cross">
                  +
                </div>

              </div>


              <div className="security-status">

                <div className="status-dot"></div>

                <div>
                  <strong>
                    Health information protected
                  </strong>

                  <small>
                    Secure & private
                  </small>
                </div>

              </div>

            </div>


            {/* Floating Card 1 */}

            <div className="floating-card records">

              <div className="floating-icon">
                📁
              </div>

              <div>
                <strong>Medical Records</strong>
                <small>12 documents</small>
              </div>

            </div>


            {/* Floating Card 2 */}

            <div className="floating-card medicine">

              <div className="floating-icon">
                💊
              </div>

              <div>
                <strong>Medications</strong>
                <small>4 active</small>
              </div>

            </div>


            {/* Floating Card 3 */}

            <div className="floating-card secure">

              <div className="floating-icon">
                🔐
              </div>

              <div>
                <strong>Protected</strong>
                <small>Your data is secure</small>
              </div>

            </div>

          </div>

        </section>


        {/* ================= TRUST STRIP ================= */}

        <section className="trust-strip">

          <div className="trust-item">
            <div>🔐</div>

            <span>
              <strong>Secure & Private</strong>
              Your health data stays protected.
            </span>
          </div>


          <div className="trust-item">
            <div>⚡</div>

            <span>
              <strong>Easy Access</strong>
              Find your information when needed.
            </span>
          </div>


          <div className="trust-item">
            <div>👥</div>

            <span>
              <strong>Share Safely</strong>
              You decide what to share.
            </span>
          </div>


          <div className="trust-item">
            <div>🛡️</div>

            <span>
              <strong>Emergency Ready</strong>
              Keep important information accessible.
            </span>
          </div>

        </section>


        {/* ================= FEATURES ================= */}

        <section className="features" id="features">

          <div className="section-heading">

            <span>POWERFUL FEATURES</span>

            <h2>
              Everything you need,
              <br />
              <em>in one place.</em>
            </h2>

            <p>
              HealthVault keeps your essential health information
              organized, accessible and under your control.
            </p>

          </div>


          <div className="feature-grid">

            <div className="feature-card">

              <div className="feature-icon">
                📁
              </div>

              <h3>Medical Records</h3>

              <p>
                Store prescriptions, lab reports, scans,
                X-rays and other important documents.
              </p>

              <a href="/medicalrecords">
                Explore feature →
              </a>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                💊
              </div>

              <h3>Medications</h3>

              <p>
                Track your medicines, dosage, schedule
                and medication history.
              </p>

              <a href="/medicine">
                Explore feature →
              </a>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                📅
              </div>

              <h3>Appointments</h3>

              <p>
                Keep track of upcoming appointments
                and your healthcare history.
              </p>

              <a href="/appoinment">
                Explore feature →
              </a>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                🚨
              </div>

              <h3>Emergency Card</h3>

              <p>
                Keep essential emergency information
                ready when it matters most.
              </p>

              <a href="/emergency">
                Explore feature →
              </a>

            </div>

          </div>

        </section>


                {/* ================= EXPLORE HEALTHVAULT ================= */}

        <section className="explore-healthvault">

          <div className="explore-header">
            <span>EXPLORE HEALTHVAULT</span>

            <h2>
              Everything you need,
              <br />
              <em>to manage your health.</em>
            </h2>

            <p>
              Explore the tools available in your personal HealthVault.
            </p>
          </div>


          <div className="explore-grid">

            {/* HEALTH PROFILE */}

            <Link to="/healthprofile" className="explore-card">

              <div className="explore-icon">
                ♡
              </div>

              <div className="explore-card-content">

                <h3>Health Profile</h3>

                <p>
                  Keep your personal health information, allergies,
                  conditions and important details organized in one place.
                </p>

                <span className="explore-link">
                  View Health Profile →
                </span>

              </div>

            </Link>


            {/* AI HEALTH ASSISTANT */}

            <Link to="/assistant" className="explore-card">

              <div className="explore-icon">
                ✦
              </div>

              <div className="explore-card-content">

                <h3>AI Health Assistant</h3>

                <p>
                  Ask health-related questions and get simple,
                  helpful information from your HealthVault AI Assistant.
                </p>

                <span className="explore-link">
                  Talk to AI Assistant →
                </span>

              </div>

            </Link>


            {/* HEALTH TIMELINE */}

            <Link to="/healthtimeline" className="explore-card">

              <div className="explore-icon">
                ◉
              </div>

              <div className="explore-card-content">

                <h3>Health Timeline</h3>

                <p>
                  View important health events, medical records,
                  medicines and appointments in chronological order.
                </p>

                <span className="explore-link">
                  View Health Timeline →
                </span>

              </div>

            </Link>

          </div>

        </section>


        {/* ================= HOW IT WORKS ================= */}

        <section className="how-it-works" id="how-it-works">

          <div className="section-heading">

            <span>HOW IT WORKS</span>

            <h2>
              Simple.
              <br />
              <em>Secure. Organized.</em>
            </h2>

          </div>


          <div className="steps">

            <div className="step">

              <div className="step-number">
                01
              </div>

              <h3>Create your account</h3>

              <p>
                Create your secure HealthVault account
                in just a few steps.
              </p>

            </div>


            <div className="step">

              <div className="step-number">
                02
              </div>

              <h3>Add your information</h3>

              <p>
                Store your medical records, medications
                and important health information.
              </p>

            </div>


            <div className="step">

              <div className="step-number">
                03
              </div>

              <h3>Access when needed</h3>

              <p>
                Find your health information whenever
                and wherever you need it.
              </p>

            </div>

          </div>

        </section>


        {/* ================= CTA ================= */}

        <section className="cta" id="about">

          <div>

            <span>
              YOUR HEALTH MATTERS
            </span>

            <h2>
              Take control of
              <br />
              your health information.
            </h2>

            <p>
              Start building your secure digital health vault today.
            </p>

          </div>


          <Link to="/signup" className="primary-btn">
            Create Your Vault
            <span>→</span>
          </Link>

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <footer>

        <div className="footer-brand">

          <div className="brand">

            <div className="brand-icon">
              🛡️
            </div>

            <span>
              Health<span>Vault</span>
            </span>

          </div>

          <p>
            Your secure digital health companion.
          </p>

        </div>


        <div className="footer-links">

          <a href="#home">Home</a>

          <a href="#features">Features</a>

          <a href="#how-it-works">
            How It Works
          </a>

          <a href="#about">
            About
          </a>

        </div>


        <p className="copyright">
          © 2026 HealthVault. All rights reserved.
        </p>

      </footer>

    </div>
  );
}


/* ================= ROUTER ================= */

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route 
          path="/dashboard" 
          element={<Dashboard />} 
        />
        <Route
          path="/healthprofile"
          element={<HealthProfile />}
        />

        <Route
          path="/medicalrecords"
          element={<MedicalRecords />}
        />

        <Route
          path="/medicine"
          element={<Medicines />}
        />

        <Route
          path="/appoinment"
          element={<Appointment />}
        />

        <Route
          path="/assistant"
          element={<Assistant />}
        />

        <Route
          path="/setting"
          element={<Settings />}
        />

        <Route 
           path="/summarization" 
           element={<Summarization />} 
        />

        <Route
          path="/healthtimeline"
          element={<HealthTimeline />}
        />

        <Route
          path="/emergency"
          element={<Emergency />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;