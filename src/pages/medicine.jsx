import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./medicine.css";

function Medicines() {

  const [showForm, setShowForm] = useState(false);

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const loadMedicines = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/medicines"
      );

      if (!response.ok) {
        throw new Error("Unable to load medicines.");
      }

      const data = await response.json();

      const formattedMedicines = data.map((medicine) => ({
        ...medicine,
        time: medicine.schedule_time || "09:00 AM",
        period: medicine.period || "Morning",
        status: medicine.status || "Pending",
      }));

      setMedicines(formattedMedicines);
    } catch (err) {
      console.error("Load Medicines Error:", err);
      setError("Could not load medicines from the database.");
    } finally {
      setLoading(false);
    }
  };

  loadMedicines();
}, []);

  const [newMedicine, setNewMedicine] = useState({
    name: "",
    dosage: "",
    frequency: ""
  });

const deleteMedicine = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this medicine?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `http://localhost:5000/api/medicines/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to delete medicine.");
    }

    setMedicines((previous) =>
      previous.filter(
        (medicine) => String(medicine.id) !== String(id)
      )
    );

    setError("");
    alert("Medicine deleted successfully!");
  } catch (err) {
    console.error("Delete Medicine Error:", err);
    setError(err.message || "Could not delete medicine.");
  }
};

const addMedicine = async (e) => {
  e.preventDefault();

  if (
    !newMedicine.name.trim() ||
    !newMedicine.dosage.trim() ||
    !newMedicine.frequency
  ) {
    alert("Please enter medicine name, dosage and frequency.");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/medicines",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newMedicine.name.trim(),
          dosage: newMedicine.dosage.trim(),
          frequency: newMedicine.frequency,
          time: "09:00 AM",
          period: "Morning",
          status: "Pending",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to save medicine.");
    }

    const savedMedicine = {
      ...data,
      time: data.schedule_time || "09:00 AM",
      period: data.period || "Morning",
      status: data.status || "Pending",
    };

    setMedicines((previous) => [
      savedMedicine,
      ...previous,
    ]);

    setNewMedicine({
      name: "",
      dosage: "",
      frequency: "",
    });

    setShowForm(false);
    setError("");

    alert("Medicine saved successfully!");
  } catch (err) {
    console.error("Save Medicine Error:", err);
    setError(err.message || "Could not save medicine.");
  }
};

const toggleMedicineStatus = async (medicine) => {
  const newStatus =
    medicine.status === "Taken" ? "Pending" : "Taken";

  try {
    const response = await fetch(
      `http://localhost:5000/api/medicines/${medicine.id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to update medicine status."
      );
    }

    setMedicines((previous) =>
      previous.map((item) =>
        item.id === medicine.id
          ? { ...item, status: data.status }
          : item
      )
    );

    setError("");
  } catch (err) {
    console.error("Update Medicine Status Error:", err);
    setError(
      err.message || "Could not update medicine status."
    );
  }
};

  return (
    <div className="medicines-page">
      
      
      {/* SIDEBAR */}
      <aside className="medicines-sidebar">

        <Link to="/dashboard" className="medicines-brand">
          <div className="medicines-brand-icon">
            🛡️
          </div>

          <span>
            Health<span>Vault</span>
          </span>
        </Link>

        <nav className="medicines-nav">

          <p className="medicines-nav-title">
            MAIN MENU
          </p>

          <Link to="/dashboard" className="medicines-nav-item">
            <span>⌂</span>
            Dashboard
          </Link>

          <Link to="/healthprofile" className="medicines-nav-item">
            <span>♡</span>
            Health Profile
          </Link>

          <Link to="/medicalrecords" className="medicines-nav-item">
            <span>▣</span>
            Medical Records
          </Link>

          <Link
             to="/medicine"
             className="medicines-nav-item active"
          >
            <span>✚</span>
            Medicines
          </Link>

          <Link to="/appoinment" className="medicines-nav-item">
            <span>◷</span>
            Appointments
          </Link>

          <p className="medicines-nav-title medicines-tools-title">
            TOOLS
          </p>

          <Link to="#" className="medicines-nav-item">
            <span>✦</span>
            AI Health Assistant
          </Link>

          <Link to="#" className="medicines-nav-item">
            <span>⚙</span>
            Settings
          </Link>

        </nav>

        <div className="medicines-sidebar-bottom">

          <Link to="/" className="medicines-home-link">
            <span>↪</span>
            Back to Home
          </Link>

        </div>

      </aside>


      {/* MAIN CONTENT */}
      <main className="medicines-main">

        {/* HEADER */}
        <header className="medicines-page-header">

          <div>
            <p className="medicines-page-label">
              MEDICATION MANAGEMENT
            </p>

            <h1>
              Medicines
            </h1>

            <p>
              Keep track of your medications and stay on schedule.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="medicines-back-button"
          >
            ← Dashboard
          </Link>

        </header>


        {/* OVERVIEW */}
        <section className="medicine-overview">

          <div className="medicine-overview-content">

            <div className="medicine-icon-large">
              ✚
            </div>

            <div>
              <span>
                YOUR MEDICATIONS
              </span>

              <h2>
                Stay consistent with your medicines
              </h2>

              <p>
                Keep your medication schedule organized and
                never lose track of an important dose.
              </p>
            </div>

          </div>

          <button
            className="add-medicine-button"
            onClick={() => setShowForm(!showForm)}>
            + Add Medicine
          </button>

        </section>
{showForm && (
  <section className="add-medicine-form">

    <div className="add-form-header">
      <div>
        <span>NEW MEDICATION</span>
        <h2>Add Medicine</h2>
      </div>

      <button
        type="button"
        onClick={() => setShowForm(false)}
        className="close-form"
      >
        ×
      </button>
    </div>

    <form onSubmit={addMedicine}>

      <div className="medicine-form-grid">

        <div className="medicine-input-group">
          <label>Medicine Name</label>

          <input
            type="text"
            placeholder="e.g. Paracetamol"
            value={newMedicine.name}
            onChange={(e) =>
              setNewMedicine({
                ...newMedicine,
                name: e.target.value
              })
            }
            required
          />
        </div>

        <div className="medicine-input-group">
          <label>Dosage</label>

          <input
            type="text"
            placeholder="e.g. 500 mg"
            value={newMedicine.dosage}
            onChange={(e) =>
              setNewMedicine({
                ...newMedicine,
                dosage: e.target.value
              })
            }
            required
          />
        </div>

        <div className="medicine-input-group">
          <label>Frequency</label>

          <select
            value={newMedicine.frequency}
            onChange={(e) =>
              setNewMedicine({
                ...newMedicine,
                frequency: e.target.value
              })
            }
            required
          >
            <option value="">Select frequency</option>
            <option value="Once daily">Once daily</option>
            <option value="Twice daily">Twice daily</option>
            <option value="Three times daily">
              Three times daily
            </option>
            <option value="As needed">
              As needed
            </option>
          </select>
        </div>

      </div>

      <button
        type="submit"
        className="save-medicine-button"
      >
        Save Medicine
      </button>

    </form>

  </section>
)}



        {/* SUMMARY CARDS */}
        <section className="medicine-summary">

          <div className="medicine-summary-card">
            <span>ACTIVE MEDICINES</span>
            <strong>{medicines.length}</strong>
          </div>

          <div className="medicine-summary-card">
            <span>TODAY'S DOSES</span>
            <strong>{medicines.length * 2}</strong>
          </div>

          <div className="medicine-summary-card">
            <span>UPCOMING</span>
            <strong>{medicines.filter(
              medicine => medicine.status === "Pending"
              ).length}
            </strong>
          </div>

          <div className="medicine-summary-card">
            <span>COMPLETED</span>
            <strong>8</strong>
          </div>

        </section>


        {/* TODAY'S SCHEDULE */}
        <section className="medicine-section">

          <div className="medicine-section-header">

            <div>
              <span>
                TODAY
              </span>

              <h2>
                Medication Schedule
              </h2>
            </div>

            <span className="today-date">
              Tuesday, 11 August
            </span>

          </div>


          <div className="dose-list">

  {medicines.map((medicine) => {

    const [time, period] = medicine.time.split(" ");

    return (
      <div className="dose-item" key={medicine.id}>

        <div className="dose-time">
          <strong>{time}</strong>
          <span>{period}</span>
        </div>

        <div
          className={
            medicine.status === "Taken"
              ? "dose-status completed"
              : "dose-status"
          }
        >
          {medicine.status === "Taken" ? "✓" : "○"}
        </div>

        <div className="dose-info">
          <h3>{medicine.name}</h3>
          <p>{medicine.dosage} · 1 tablet</p>
        </div>

        <span className="dose-period">
          {medicine.period}
        </span>

        <button
        className={
          medicine.status === "Taken"
          ? "dose-action completed-action"
          : "dose-action"
        }
        onClick={() => toggleMedicineStatus(medicine)}
        >
          {medicine.status === "Taken" ? "Taken" : "Mark Taken"}
          </button>

      </div>
    );
  })}

</div>

        </section>


       {/* ACTIVE MEDICINES */}
<section className="medicine-section">

  <div className="medicine-section-header">

    <div>
      <span>
        CURRENT MEDICATIONS
      </span>

      <h2>
        Active Medicines
      </h2>
    </div>

    <button className="view-all-button">
      View All →
    </button>

  </div>


  <div className="active-medicine-list">

    {medicines.map((medicine) => (

      <div
        className="active-medicine-item"
        key={medicine.id}
      >

        <div className="medicine-item-icon">
          💊
        </div>

        <div className="active-medicine-info">

          <h3>
            {medicine.name}
          </h3>

          <p>
            {medicine.dosage} · {medicine.frequency}
          </p>

        </div>

        <div className="medicine-duration">

          <span>SCHEDULE</span>

          <strong>
            {medicine.time}
          </strong>

        </div>

        <div className="medicine-duration">

          <span>STATUS</span>

          <strong>
            {medicine.status}
          </strong>

        </div>

        <span className="medicine-active-badge">
          {medicine.status === "Taken" ? "Taken" : "Active"}
        </span>

        <button
        className="medicine-delete-button"
        onClick={() => deleteMedicine(medicine.id)}
        >
          Delete
        </button>

      </div>

    ))}

  </div>

</section>


        {/* NOTE */}
        <div className="medicine-security-note">

          <span>🛡️</span>

          <p>
            Medication information shown here is for personal
            organization. Always follow your healthcare provider's instructions.
          </p>

        </div>

      </main>

    </div>
  );
}

export default Medicines;