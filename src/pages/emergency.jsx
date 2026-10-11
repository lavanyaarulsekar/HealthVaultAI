
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./emergency.css";

const emptyInfo = {
  bloodGroup: "",
  allergies: "",
  conditions: "",
  medications: "",
  contactName: "",
  contactPhone: "",
};

function Emergency() {
  const [info, setInfo] = useState(emptyInfo);
  const [form, setForm] = useState(emptyInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  
useEffect(() => {
  async function loadEmergencyInfo() {
    try {
      const response = await fetch("http://localhost:5000/api/emergency-card");

      if (!response.ok) {
        throw new Error("Failed to load emergency information");
      }

      const data = await response.json();
      setInfo({ ...emptyInfo, ...data });
      setForm({ ...emptyInfo, ...data });
    } catch (error) {
      console.error("Error loading emergency information:", error);
    }
  }

  loadEmergencyInfo();
}, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setSaved(false);
  }

  
async function handleSave(event) {
  event.preventDefault();

  const cleaned = {
    ...form,
    contactPhone: form.contactPhone.trim(),
  };

  try {
    const response = await fetch("http://localhost:5000/api/emergency-card", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleaned),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to save emergency information");
    }

    setInfo({ ...emptyInfo, ...data });
    setForm({ ...emptyInfo, ...data });
    setIsEditing(false);
    setSaved(true);
  } catch (error) {
    console.error("Error saving emergency information:", error);
    alert("Unable to save information. Please check whether the backend is running.");
  }
}

  function handleCancel() {
    setForm(info);
    setIsEditing(false);
    setSaved(false);
  }

  function display(value) {
    return value.trim() || "Not Added";
  }

  return (
    <div className="emergency-page">
      <div className="emergency-header">
        <div className="emergency-icon">🚨</div>
        <div>
          <span>HEALTHVAULT</span>
          <h1>Emergency Health Card</h1>
          <p>
            Keep your essential health information ready when it matters most.
          </p>
        </div>
      </div>

      <div className="emergency-card">
        <div className="emergency-card-title">
          <h2>Emergency Information</h2>
          <span>⚠️</span>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave}>
            <div className="emergency-grid">
              <label className="emergency-info">
                <span>Blood Group</span>
                <select
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                >
                  <option value="">Select blood group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label className="emergency-info">
                <span>Allergies</span>
                <textarea
                  name="allergies"
                  value={form.allergies}
                  onChange={handleChange}
                  placeholder="Enter allergies, or None known"
                  rows={2}
                />
              </label>

              <label className="emergency-info">
                <span>Medical Conditions</span>
                <textarea
                  name="conditions"
                  value={form.conditions}
                  onChange={handleChange}
                  placeholder="Enter relevant conditions"
                  rows={2}
                />
              </label>

              <label className="emergency-info">
                <span>Current Medications</span>
                <textarea
                  name="medications"
                  value={form.medications}
                  onChange={handleChange}
                  placeholder="Enter current medications"
                  rows={2}
                />
              </label>
            </div>

            <div className="emergency-grid emergency-contact-fields">
              <label className="emergency-info">
                <span>Emergency Contact Name</span>
                <input
                  name="contactName"
                  value={form.contactName}
                  onChange={handleChange}
                  placeholder="Contact person's name"
                />
              </label>

              <label className="emergency-info">
                <span>Emergency Contact Phone</span>
                <input
                  name="contactPhone"
                  type="tel"
                  value={form.contactPhone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </label>
            </div>

            <div className="emergency-actions">
              <button type="submit">💾 Save Information</button>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="emergency-grid">
              <div className="emergency-info">
                <span>Blood Group</span>
                <strong>{display(info.bloodGroup)}</strong>
              </div>

              <div className="emergency-info">
                <span>Allergies</span>
                <strong>{display(info.allergies)}</strong>
              </div>

              <div className="emergency-info">
                <span>Medical Conditions</span>
                <strong>{display(info.conditions)}</strong>
              </div>

              <div className="emergency-info">
                <span>Current Medications</span>
                <strong>{display(info.medications)}</strong>
              </div>
            </div>

            <div className="emergency-contact">
              <div>
                <span>Emergency Contact</span>
                <strong>{display(info.contactName)}</strong>
                {info.contactPhone.trim() && (
                  <p>{info.contactPhone}</p>
                )}
              </div>

              {info.contactPhone.trim() ? (
                <a
                  className="emergency-call-button"
                  href={`tel:${info.contactPhone.replace(/[^\d+]/g, "")}`}
                >
                  📞 Emergency Call
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                >
                  Add Contact
                </button>
              )}
            </div>

            <div className="emergency-actions">
              <button type="button" onClick={() => setIsEditing(true)}>
                ✏️ Edit Information
              </button>
            </div>

            {saved && (
              <p role="status" className="emergency-saved">
                ✓ Emergency information saved successfully.
              </p>
            )}
          </>
        )}
      </div>

      <div className="emergency-note">
        🛡️ Your emergency information should be kept accurate and up to date.
      </div>

      <Link to="/" className="back-home">
        ← Back Home
      </Link>
    </div>
  );
}

export default Emergency;
