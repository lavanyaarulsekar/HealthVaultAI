import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./setting.css";

function Settings() {

  
const defaultSettings = {
  fullName: "",
  email: "",
  twoFactor: false,
  appointmentReminders: true,
  medicineReminders: true,
};

const [settings, setSettings] = useState(defaultSettings);
const [saved, setSaved] = useState(false);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadSettings() {
    try {
      const response = await fetch("http://localhost:5000/api/settings");

      if (!response.ok) {
        throw new Error("Failed to load settings");
      }

      const data = await response.json();
      setSettings({ ...defaultSettings, ...data });
    } catch (error) {
      console.error("Error loading settings:", error);
      alert("Unable to load settings. Please check your backend.");
    } finally {
      setLoading(false);
    }
  }

  loadSettings();
}, []);


  const updateSetting = (key, value) => {
    setSettings((previousSettings) => ({
      ...previousSettings,
      [key]: value
    }));

    setSaved(false);
  };

  
const handleSave = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to save settings");
    }

    setSettings({ ...defaultSettings, ...data });
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  } catch (error) {
    console.error("Error saving settings:", error);
    alert("Unable to save settings. Please check your backend.");
  }
};


  
const handleReset = async () => {
  const confirmed = window.confirm(
    "Reset all Settings preferences to their defaults?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch("http://localhost:5000/api/settings/reset", {
      method: "POST",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to reset settings");
    }

    setSettings({ ...defaultSettings, ...data });
    setSaved(false);
  } catch (error) {
    console.error("Error resetting settings:", error);
    alert("Unable to reset settings. Please check your backend.");
  }
};

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to log out?"
    );

    if (confirmLogout) {
      alert("Logout is currently available in frontend demo mode.");
    }
  };

  if (loading) {
  return <div className="settings-page">Loading settings...</div>;
}

  return (
    <div className="settings-page">

      {/* SIDEBAR */}
      <aside className="settings-sidebar">

        <Link to="/dashboard" className="settings-brand">

          <div className="settings-brand-icon">
            🛡️
          </div>

          <span>
            Health<span>Vault</span>
          </span>

        </Link>


        <nav className="settings-nav">

          <p className="settings-nav-title">
            MAIN MENU
          </p>

          <Link to="/dashboard" className="settings-nav-item">
            <span>⌂</span>
            Dashboard
          </Link>

          <Link to="/healthprofile" className="settings-nav-item">
            <span>♡</span>
            Health Profile
          </Link>

          <Link to="/medicalrecords" className="settings-nav-item">
            <span>▣</span>
            Medical Records
          </Link>

          <Link to="/medicine" className="settings-nav-item">
            <span>✚</span>
            Medicines
          </Link>

          <Link to="/appoinment" className="settings-nav-item">
            <span>◷</span>
            Appointments
          </Link>


          <p className="settings-nav-title settings-tools-title">
            TOOLS
          </p>

          <Link to="/assistant" className="settings-nav-item">
            <span>✦</span>
            AI Health Assistant
          </Link>

          <Link to="/setting" className="settings-nav-item active">
            <span>⚙</span>
            Settings
          </Link>

        </nav>


        <div className="settings-sidebar-bottom">

          <Link to="/" className="settings-home-link">
            <span>↪</span>
            Back to Home
          </Link>

        </div>

      </aside>


      {/* MAIN */}
      <main className="settings-main">

        <header className="settings-header">

          <div>

            <p className="settings-label">
              ACCOUNT MANAGEMENT
            </p>

            <h1>
              Settings
            </h1>

            <p>
              Manage your account and HealthVault preferences.
            </p>

          </div>

          <Link
            to="/dashboard"
            className="settings-dashboard-button"
          >
            ← Dashboard
          </Link>

        </header>


        {/* PROFILE */}
        <section className="settings-card">

          <div className="settings-card-heading">

            <div className="settings-card-icon">
              ♙
            </div>

            <div>
              <h2>Account Information</h2>
              <p>Manage your personal account details.</p>
            </div>

          </div>


          <div className="settings-form-grid">

            <div className="settings-field">

              <label>
                Full Name
              </label>

              <input
                type="text"
                placeholder="Your full name"
                value={settings.fullName}
                onChange={(e) =>
                  updateSetting(
                    "fullName",
                    e.target.value
                  )
                }
              />

            </div>


            <div className="settings-field">

              <label>
                Email Address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={settings.email}
                onChange={(e) =>
                  updateSetting(
                    "email",
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          <button
            className="settings-save"
            onClick={handleSave}
          >
            Save Changes
          </button>


          {saved && (
            <span className="settings-saved-message">
              ✓ Changes saved successfully
            </span>
          )}

        </section>


        {/* SECURITY */}
        <section className="settings-card">

          <div className="settings-card-heading">

            <div className="settings-card-icon">
              🔒
            </div>

            <div>
              <h2>Security</h2>
              <p>Keep your HealthVault account secure.</p>
            </div>

          </div>


          <div className="settings-option">

            <div>
              <h3>Change Password</h3>

              <p>
                Password management will be connected
                when authentication is added.
              </p>
            </div>

            <button
              className="settings-outline-button"
              onClick={() =>
                alert(
                  "Password management will be available when the backend is connected."
                )
              }
            >
              Change
            </button>

          </div>


          <div className="settings-option">

            <div>
              <h3>Two-Factor Authentication</h3>

              <p>
                Add an additional layer of account protection.
              </p>
            </div>

            <label className="settings-toggle">

              <input
                type="checkbox"
                checked={settings.twoFactor}
                onChange={(e) =>
                  updateSetting(
                    "twoFactor",
                    e.target.checked
                  )
                }
              />

              <span></span>

            </label>

          </div>

        </section>


        {/* NOTIFICATIONS */}
        <section className="settings-card">

          <div className="settings-card-heading">

            <div className="settings-card-icon">
              🔔
            </div>

            <div>
              <h2>Notifications</h2>

              <p>
                Choose what notifications you receive.
              </p>
            </div>

          </div>


          <div className="settings-option">

            <div>
              <h3>Appointment Reminders</h3>

              <p>
                Receive reminders about upcoming appointments.
              </p>
            </div>

            <label className="settings-toggle">

              <input
                type="checkbox"
                checked={settings.appointmentReminders}
                onChange={(e) =>
                  updateSetting(
                    "appointmentReminders",
                    e.target.checked
                  )
                }
              />

              <span></span>

            </label>

          </div>


          <div className="settings-option">

            <div>
              <h3>Medicine Reminders</h3>

              <p>
                Receive reminders when it is time to take medicines.
              </p>
            </div>

            <label className="settings-toggle">

              <input
                type="checkbox"
                checked={settings.medicineReminders}
                onChange={(e) =>
                  updateSetting(
                    "medicineReminders",
                    e.target.checked
                  )
                }
              />

              <span></span>

            </label>

          </div>

        </section>


        {/* PRIVACY */}
        <section className="settings-card">

          <div className="settings-card-heading">

            <div className="settings-card-icon">
              🛡️
            </div>

            <div>
              <h2>Privacy</h2>

              <p>
                Control your HealthVault data preferences.
              </p>
            </div>

          </div>


          <div className="privacy-note">

            <span>
              🔐
            </span>

            <p>
              Your HealthVault settings and preferences are
              currently stored locally in your browser.
              Backend authentication and secure cloud storage
              can be connected later.
            </p>

          </div>

        </section>


        {/* ACCOUNT ACTIONS */}
        <section className="settings-card danger-card">

          <div>

            <h2>
              Account Actions
            </h2>

            <p>
              Reset your frontend preferences or log out.
            </p>

          </div>


          <div className="settings-account-actions">

            <button
              className="reset-button"
              onClick={handleReset}
            >
              Reset Settings
            </button>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Log Out
            </button>

          </div>

        </section>


        <div className="settings-footer">
          HealthVault · Securely manage your health information
        </div>

      </main>

    </div>
  );
}

export default Settings;