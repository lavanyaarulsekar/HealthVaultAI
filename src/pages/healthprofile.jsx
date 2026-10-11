import { Link } from "react-router-dom";
import "./healthProfile.css";
import { useState, useEffect } from "react";
import { healthProfile } from "../data/healthdata";

function HealthProfile() {
  
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem("healthProfile");
    return savedProfile ? JSON.parse(savedProfile) : healthProfile;
  });

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  const updateProfile = (field, value) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSaved(false);
    setError("");
  };

  const updateEmergencyContact = (field, value) => {
    setProfile((previous) => ({
      ...previous,
      emergencyContact: {
        ...(previous.emergencyContact || {}),
        [field]: value,
      },
    }));

    setSaved(false);
    setError("");
  };

  // Load the profile from PostgreSQL
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/health-profile"
        );

        if (!response.ok) {
          throw new Error("Unable to load your health profile.");
        }

        const data = await response.json();

        if (data) {
          setProfile((previous) => ({
            ...previous,
            name: data.name ?? previous.name,
            phone: data.phone ?? previous.phone,
            gender: data.gender ?? previous.gender,
            bloodGroup: data.blood_group ?? previous.bloodGroup,
            height: data.height
              ? String(data.height).replace(/[^0-9.]/g, "")
              : previous.height,
            weight: data.weight
              ? String(data.weight).replace(/[^0-9.]/g, "")
              : previous.weight,
            email: data.email ?? previous.email,
            dateOfBirth: data.date_of_birth
            ? String(data.date_of_birth).slice(0, 10)
            : previous.dateOfBirth,
            allergies: data.allergies ?? previous.allergies,
            medicalConditions:
            data.medical_conditions ?? previous.medicalConditions,

            
            
          emergencyContact: {
            ...(previous.emergencyContact || {}),
            name: data.emergency_contact ?? previous.emergencyContact?.name ?? "",
            relationship:
            data.emergency_relationship ??
            previous.emergencyContact?.relationship ??
            "",
            phone: data.emergency_phone ?? previous.emergencyContact?.phone ?? "",
          },

          }));
        }
      } catch (err) {
        setError("Could not load data from PostgreSQL. Please check your backend.");
        console.error(err);
      }
    };

    loadProfile();
  }, []);

  // Keep a local backup
  useEffect(() => {
    localStorage.setItem("healthProfile", JSON.stringify(profile));
  }, [profile]);


 

  
  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/health-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: profile.name,
            age: null,
            gender: profile.gender,
            blood_group: profile.bloodGroup,
            height: profile.height ? `${profile.height} cm` : null,
            weight: profile.weight ? `${profile.weight} kg` : null,
            phone: profile.phone,
            emergency_contact: profile.emergencyContact?.name || "",
            emergency_phone: profile.emergencyContact?.phone || "",
            
            email: profile.email || null,
            date_of_birth: profile.dateOfBirth || null,
            allergies: profile.allergies || null,
            medical_conditions: profile.medicalConditions || null,
            emergency_relationship: profile.emergencyContact?.relationship || null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Unable to save your health profile.");
      }

      const data = await response.json();

      // Keep the returned database values in sync with the form
      setProfile((previous) => ({
        ...previous,
        name: data.name ?? previous.name,
        phone: data.phone ?? previous.phone,
        gender: data.gender ?? previous.gender,
        bloodGroup: data.blood_group ?? previous.bloodGroup,
        height: data.height
          ? String(data.height).replace(/[^0-9.]/g, "")
          : previous.height,
        weight: data.weight
          ? String(data.weight).replace(/[^0-9.]/g, "")
          : previous.weight,
        emergencyContact: {
          ...(previous.emergencyContact || {}),
          name: data.emergency_contact ?? "",
          phone: data.emergency_phone ?? "",
        },
      }));

      setSaved(true);
    } catch (err) {
      setError("Could not save your profile. Please check your backend.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="health-profile-page">

      {/* SIDEBAR */}
      <aside className="profile-sidebar">

        <Link to="/dashboard" className="profile-brand">
          <div className="profile-brand-icon">
            🛡️
          </div>

          <span>
            Health<span>Vault</span>
          </span>
        </Link>

        <nav className="profile-nav">

          <p className="profile-nav-title">
            MAIN MENU
          </p>

          <Link to="/dashboard" className="profile-nav-item">
            <span>⌂</span>
            Dashboard
          </Link>

          <Link
            to="/healthprofile"
            className="profile-nav-item active"
          >
            <span>♡</span>
            Health Profile
          </Link>

          <Link
            to="/medicalrecords"
            className="profile-nav-item"
          >
            <span>▣</span>
            Medical Records
          </Link>

          <Link
            to="/medicine"
            className="profile-nav-item"
          >
            <span>✚</span>
            Medicines
          </Link>

          <Link
            to="/appoinment"
            className="profile-nav-item"
          >
            <span>◷</span>
            Appointments
          </Link>

          <p className="profile-nav-title profile-tools-title">
            TOOLS
          </p>

          <Link
            to="/assistant"
            className="profile-nav-item"
          >
            <span>✦</span>
            AI Health Assistant
          </Link>

          <Link
            to="/setting"
            className="profile-nav-item"
          >
            <span>⚙</span>
            Settings
          </Link>

        </nav>

        <div className="profile-sidebar-bottom">

          <Link to="/" className="profile-home-link">
            <span>↪</span>
            Back to Home
          </Link>

        </div>

      </aside>


      {/* MAIN CONTENT */}
      <main className="health-profile-main">

        {/* HEADER */}
        <header className="profile-page-header">

          <div>
            <p className="profile-page-label">
              PERSONAL HEALTH
            </p>

            <h1>
              Health Profile
            </h1>

            <p>
              Keep your personal and health information up to date.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="profile-back-button"
          >
            ← Dashboard
          </Link>

        </header>


        {/* PROFILE OVERVIEW */}
        <section className="profile-overview-card">

          <div className="profile-avatar-large">
            {profile.name ? profile.name.charAt(0).toUpperCase() : "L"}
          </div>

          <div className="profile-overview-info">

            <span className="profile-member-label">
              HEALTHVAULT MEMBER
            </span>

            <h2>
              {profile.name || "Your Name"}
            </h2>

            <p>
              Your health information is securely organized
              in your personal HealthVault.
            </p>

          </div>

          <button
            className="edit-profile-button"
            onClick={() => {
              document
                .querySelector(".health-profile-main")
                .scrollTo({
                  top: 250,
                  behavior: "smooth",
                });
            }}
          >
            ✎ Edit Profile
          </button>

        </section>


        {/* PERSONAL INFORMATION */}
        <section className="health-section">

          <div className="health-section-header">

            <div>
              <span>
                BASIC DETAILS
              </span>

              <h2>
                Personal Information
              </h2>
            </div>

          </div>


          <div className="health-form-grid">

            <div className="health-input-group">
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={profile.name}
                onChange={(e) =>
                  updateProfile("name", e.target.value)
                }
              />
            </div>


            <div className="health-input-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="you@example.com"
                value={profile.email}
                onChange={(e) =>
                  updateProfile("email", e.target.value)
                }
              />
            </div>


            <div className="health-input-group">
              <label>Date of Birth</label>

              <input
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) =>
                  updateProfile("dateOfBirth", e.target.value)
                }
              />
            </div>


            <div className="health-input-group">
              <label>Phone Number</label>

              <input
                type="tel"
                placeholder="Enter phone number"
                value={profile.phone}
                onChange={(e) =>
                  updateProfile("phone", e.target.value)
                }
              />
            </div>

          </div>

        </section>


        {/* HEALTH INFORMATION */}
        <section className="health-section">

          <div className="health-section-header">

            <div>
              <span>
                HEALTH DETAILS
              </span>

              <h2>
                Health Information
              </h2>
            </div>

          </div>


          <div className="health-form-grid">

            <div className="health-input-group">

              <label>
                Blood Group
              </label>

              <select
                value={profile.bloodGroup}
                onChange={(e) =>
                  updateProfile("bloodGroup", e.target.value)
                }
              >
                <option value="" disabled>
                  Select blood group
                </option>

                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
                <option>O+</option>
                <option>O-</option>
              </select>

            </div>


            <div className="health-input-group">

              <label>
                Gender
              </label>

              <select
                value={profile.gender}
                onChange={(e) =>
                  updateProfile("gender", e.target.value)
                }
              >
                <option value="" disabled>
                  Select gender
                </option>

                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>

            </div>


            <div className="health-input-group">

              <label>
                Height
              </label>

              <div className="input-with-unit">

                <input
                  type="number"
                  placeholder="Enter height"
                  value={profile.height}
                  onChange={(e) =>
                    updateProfile("height", e.target.value)
                  }
                />

                <span>cm</span>

              </div>

            </div>


            <div className="health-input-group">

              <label>
                Weight
              </label>

              <div className="input-with-unit">

                <input
                  type="number"
                  placeholder="Enter weight"
                  value={profile.weight}
                  onChange={(e) =>
                    updateProfile("weight", e.target.value)
                  }
                />

                <span>kg</span>

              </div>

            </div>

          </div>


          <div className="health-textarea-group">

            <label>
              Allergies
            </label>

            <textarea
              placeholder="List any known allergies..."
              rows="3"
              value={profile.allergies}
              onChange={(e) =>
                updateProfile("allergies", e.target.value)
              }
            ></textarea>

          </div>


          <div className="health-textarea-group">

            <label>
              Medical Conditions
            </label>

            <textarea
              placeholder="List any existing medical conditions..."
              rows="3"
              value={profile.medicalConditions}
              onChange={(e) =>
                updateProfile("medicalConditions", e.target.value)
              }
            ></textarea>

          </div>

        </section>


        {/* EMERGENCY CONTACT */}
        <section className="health-section">

          <div className="health-section-header">

            <div>
              <span>
                EMERGENCY
              </span>

              <h2>
                Emergency Contact
              </h2>
            </div>

          </div>


          <div className="health-form-grid">

            <div className="health-input-group">

              <label>
                Contact Name
              </label>

              <input
                type="text"
                placeholder="Emergency contact name"
                value={profile.emergencyContact.name}
                onChange={(e) =>
                  updateEmergencyContact(
                    "name",
                    e.target.value
                  )
                }
              />

            </div>


            <div className="health-input-group">

              <label>
                Relationship
              </label>

              <input
                type="text"
                placeholder="Example: Parent, Sibling"
                value={profile.emergencyContact.relationship}
                onChange={(e) =>
                  updateEmergencyContact(
                    "relationship",
                    e.target.value
                  )
                }
              />

            </div>


            <div className="health-input-group">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                placeholder="Emergency contact number"
                value={profile.emergencyContact.phone}
                onChange={(e) =>
                  updateEmergencyContact(
                    "phone",
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        </section>


        {/* SAVE AREA */}
        <div className="profile-save-area">

          <p>
            Your information will be securely stored in HealthVault.
          </p>

          <button
            className="save-profile-button"
            onClick={handleSave}
            disabled={saving}
          >
          {saving
            ? "Saving..."
            : saved
            ? "✓ Changes Saved"
            : "Save Changes →"}
          </button>

{error && <p role="alert">{error}</p>}
        </div>

      </main>

    </div>
  );
}

export default HealthProfile;