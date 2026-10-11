import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./medicalrecord.css";
import { medicalRecords as defaultRecords } from "../data/healthdata";

function MedicalRecords() {
 
const [records, setRecords] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  const loadRecords = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/medical-records"
      );

      if (!response.ok) {
        throw new Error("Unable to load medical records.");
      }

      const data = await response.json();
      setRecords(data);
    } catch (err) {
      console.error("Load Medical Records Error:", err);
      setError("Could not load records from the database.");
    } finally {
      setLoading(false);
    }
  };

  loadRecords();
}, []);


  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Records");
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [newRecord, setNewRecord] = useState({
    name: "",
    description: "",
    category: "Lab Report",
    date: ""
  });

  const saveRecords = (updatedRecords) => {
    setRecords(updatedRecords);
    localStorage.setItem(
      "healthVaultRecords",
      JSON.stringify(updatedRecords)
    );
  };

  
const handleAddRecord = async (e) => {
  e.preventDefault();

  if (
    !newRecord.name.trim() ||
    !newRecord.description.trim() ||
    !newRecord.date
  ) {
    alert("Please fill in all the fields.");
    return;
  }

  const parsedDate = new Date(newRecord.date);

  if (Number.isNaN(parsedDate.getTime())) {
    alert("Please enter a valid date, such as 2026-10-10.");
    return;
  }

  const formattedDate = [
    parsedDate.getFullYear(),
    String(parsedDate.getMonth() + 1).padStart(2, "0"),
    String(parsedDate.getDate()).padStart(2, "0"),
  ].join("-");

  try {
    const response = await fetch(
      "http://localhost:5000/api/medical-records",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newRecord.name.trim(),
          description: newRecord.description.trim(),
          category: newRecord.category,
          date: formattedDate,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to save the record.");
    }

    setRecords((previous) => [data, ...previous]);

    setNewRecord({
      name: "",
      description: "",
      category: "Lab Report",
      date: "",
    });

    setShowForm(false);
    setError("");
    alert("Medical record saved successfully!");
  } catch (err) {
    console.error("Save Medical Record Error:", err);
    setError(err.message || "Could not save the medical record.");
  }
};


const handleDeleteRecord = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this medical record?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `http://localhost:5000/api/medical-records/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to delete the record.");
    }

    // Remove the deleted record from the screen
    setRecords((previous) =>
      previous.filter((record) => String(record.id) !== String(id))
    );

    if (selectedRecord && String(selectedRecord.id) === String(id)) {
      setSelectedRecord(null);
    }

    setError("");
    alert("Medical record deleted successfully!");
  } catch (err) {
    console.error("Delete Medical Record Error:", err);
    setError(err.message || "Could not delete the medical record.");
  }
};

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.name.toLowerCase().includes(search.toLowerCase()) ||
      record.description.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All Records" ||
      record.category === filter;

    return matchesSearch && matchesFilter;
  });

  const labReports = records.filter(
    (record) => record.category === "Lab Report"
  ).length;

  const prescriptions = records.filter(
    (record) => record.category === "Prescription"
  ).length;

  const thisMonth = records.filter((record) =>
    record.date.includes("Aug 2026")
  ).length;

  return (
    <div className="medical-records-page">

      {/* SIDEBAR */}
      <aside className="records-sidebar">

        <Link to="/dashboard" className="records-brand">
          <div className="records-brand-icon">
            🛡️
          </div>

          <span>
            Health<span>Vault</span>
          </span>
        </Link>

        <nav className="records-nav">

          <p className="records-nav-title">
            MAIN MENU
          </p>

          <Link to="/dashboard" className="records-nav-item">
            <span>⌂</span>
            Dashboard
          </Link>

          <Link to="/healthprofile" className="records-nav-item">
            <span>♡</span>
            Health Profile
          </Link>

          <Link
            to="/medicalrecords"
            className="records-nav-item active"
          >
            <span>▣</span>
            Medical Records
          </Link>

          <Link to="/medicine" className="records-nav-item">
            <span>✚</span>
            Medicines
          </Link>

          <Link to="/appoinment" className="records-nav-item">
            <span>◷</span>
            Appointments
          </Link>

          <p className="records-nav-title records-tools-title">
            TOOLS
          </p>

          <Link to="/assistant" className="records-nav-item">
            <span>✦</span>
            AI Health Assistant
          </Link>

          <Link to="/setting" className="records-nav-item">
            <span>⚙</span>
            Settings
          </Link>

        </nav>

        <div className="records-sidebar-bottom">

          <Link to="/" className="records-home-link">
            <span>↪</span>
            Back to Home
          </Link>

        </div>

      </aside>


      {/* MAIN CONTENT */}
      <main className="medical-records-main">

        {/* HEADER */}
        <header className="records-page-header">

          <div>
            <p className="records-page-label">
              HEALTH DOCUMENTS
            </p>

            <h1>
              Medical Records
            </h1>

            <p>
              Securely manage your medical documents and health reports.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="records-back-button"
          >
            ← Dashboard
          </Link>

        </header>


        {/* UPLOAD ACTION */}
        <section className="records-action-card">

          <div className="records-action-content">

            <div className="records-upload-icon">
              ↑
            </div>

            <div>
              <span>
                KEEP YOUR HEALTH HISTORY ORGANIZED
              </span>

              <h2>
                Add a medical record
              </h2>

              <p>
                Store prescriptions, lab reports, scans and other
                important health documents in one secure place.
              </p>
            </div>

          </div>

          <button
            className="upload-record-button"
            onClick={() => setShowForm(!showForm)}
          >
            + Add Record
          </button>

        </section>


        {/* ADD RECORD FORM */}
        {showForm && (
          <section className="record-form-card">

            <div className="record-form-header">
              <div>
                <span>NEW DOCUMENT</span>
                <h2>Add Medical Record</h2>
              </div>

              <button
                className="record-form-close"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddRecord}>

              <div className="record-form-grid">

                <div className="record-form-group">
                  <label>Record Name</label>

                  <input
                    type="text"
                    placeholder="e.g. Blood Test Report"
                    value={newRecord.name}
                    onChange={(e) =>
                      setNewRecord({
                        ...newRecord,
                        name: e.target.value
                      })
                    }
                  />
                </div>


                <div className="record-form-group">
                  <label>Category</label>

                  <select
                    value={newRecord.category}
                    onChange={(e) =>
                      setNewRecord({
                        ...newRecord,
                        category: e.target.value
                      })
                    }
                  >
                    <option>Lab Report</option>
                    <option>Prescription</option>
                    <option>Scans & Imaging</option>
                    <option>Other Documents</option>
                  </select>
                </div>


                <div className="record-form-group">
                  <label>Date</label>

                  <input
                    type="date"
                    placeholder="Select date"
                    value={newRecord.date}
                    onChange={(e) =>
                      setNewRecord({
                        ...newRecord,
                        date: e.target.value
                      })
                    }
                  />
                </div>


                <div className="record-form-group">
                  <label>Description</label>

                  <input
                    type="text"
                    placeholder="Short description"
                    value={newRecord.description}
                    onChange={(e) =>
                      setNewRecord({
                        ...newRecord,
                        description: e.target.value
                      })
                    }
                  />
                </div>

              </div>

              <button
                type="submit"
                className="save-record-button"
              >
                Save Record
              </button>

            </form>

          </section>
        )}


        {/* SEARCH + FILTER */}

        {error && (
          <p style={{ color: "red", margin: "12px 0" }}>
            {error}
          </p>
        )}


        <section className="records-toolbar">

          <div className="records-search">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search medical records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <select
            className="records-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >

            <option>All Records</option>
            <option>Lab Report</option>
            <option>Prescription</option>
            <option>Scans & Imaging</option>
            <option>Other Documents</option>

          </select>

        </section>


        {/* RECORD SUMMARY */}
        <section className="record-summary">

          <div>
            <span>TOTAL RECORDS</span>
            <strong>{records.length}</strong>
          </div>

          <div>
            <span>THIS MONTH</span>
            <strong>{thisMonth}</strong>
          </div>

          <div>
            <span>LAB REPORTS</span>
            <strong>{labReports}</strong>
          </div>

          <div>
            <span>PRESCRIPTIONS</span>
            <strong>{prescriptions}</strong>
          </div>

        </section>


        {/* RECORDS LIST */}
        <section className="records-list-card">

          <div className="records-list-header">

            <div>
              <span>YOUR DOCUMENTS</span>

              <h2>
                Recent records
              </h2>
            </div>

            <span className="records-count">
              {filteredRecords.length} records
            </span>

          </div>


          {/* RECORDS */}
          {filteredRecords.length === 0 ? (

            <div className="no-records">
              <div>📄</div>
              <h3>No records found</h3>
              <p>
                Try changing your search or filter.
              </p>
            </div>

          ) : (

            filteredRecords.map((record) => (

              <div
                className="medical-record-item"
                key={record.id}
              >

                <div className="medical-record-icon lab-icon">
                  ▣
                </div>


                <div className="medical-record-info">

                  <h3>
                    {record.name}
                  </h3>

                  <p>
                    {record.description}
                  </p>

                  <span>
                    Added on {record.date}
                  </span>

                </div>


                <div className="medical-record-type">
                  {record.category}
                </div>


                <button
                  className="record-view-button"
                  onClick={() => setSelectedRecord(record)}
                >
                  View →
                </button>


                <button
                  className="record-delete-button"
                  onClick={() => handleDeleteRecord(record.id)}
                >
                  Delete
                </button>

              </div>

            ))

          )}

        </section>


        {/* RECORD DETAILS */}
        {selectedRecord && (

          <div className="record-modal-overlay">

            <div className="record-modal">

              <button
                className="record-modal-close"
                onClick={() => setSelectedRecord(null)}
              >
                ×
              </button>

              <span className="record-modal-label">
                MEDICAL RECORD
              </span>

              <h2>
                {selectedRecord.name}
              </h2>

              <div className="record-modal-info">

                <p>
                  <strong>Category:</strong>{" "}
                  {selectedRecord.category}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {selectedRecord.date}
                </p>

                <p>
                  <strong>Description:</strong>{" "}
                  {selectedRecord.description}
                </p>

              </div>

            </div>

          </div>

        )}


        {/* SECURITY NOTE */}
        <div className="records-security-note">

          <span>
            🛡️
          </span>

          <p>
            Your medical records are private and securely stored.
            Only you can access your health documents.
          </p>

        </div>

      </main>

    </div>
  );
}

export default MedicalRecords;