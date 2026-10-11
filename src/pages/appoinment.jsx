import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./appoinment.css";

  
function Appointment() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
const [showForm, setShowForm] = useState(false);

const [searchTerm, setSearchTerm] = useState("");
const [appliedSearch, setAppliedSearch] = useState("");
const [filterDate, setFilterDate] = useState("");
const [filterStatus, setFilterStatus] = useState("All");

const [newAppointment, setNewAppointment] = useState({
  title: "",
  doctor: "",
  location: "",
  appointment_date: "",
  appointment_time: "",
});


  const loadAppointments = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/appointments"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load appointments."
        );
      }

      const formattedAppointments = data.map((appointment) => ({
        ...appointment,
        date: new Date(appointment.appointment_date)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC",
          })
          .replace(/ /g, " "),
        time: appointment.appointment_time,
      }));

      setAppointments(formattedAppointments);
      setError("");
    } catch (err) {
      console.error("Load Appointments Error:", err);
      setError("Could not load appointments from the database.");
    } finally {
      setLoading(false);
    }
  };

  
const addAppointment = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      "http://localhost:5000/api/appointments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newAppointment,
          status: "Upcoming",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to save appointment."
      );
    }

    const savedAppointment = {
      ...data,
      date: new Date(data.appointment_date)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        }),
      time: data.appointment_time,
    };

    setAppointments((previous) => [
      ...previous,
      savedAppointment,
    ]);

    setNewAppointment({
      title: "",
      doctor: "",
      location: "",
      appointment_date: "",
      appointment_time: "",
    });

    setShowForm(false);
    setError("");
    alert("Appointment booked successfully!");
  } catch (err) {
    console.error("Add Appointment Error:", err);
    setError(err.message || "Could not save appointment.");
  }
};


const updateAppointmentStatus = async (id, status) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/appointments/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to update appointment status."
      );
    }

    setAppointments((previous) =>
      previous.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: data.status }
          : appointment
      )
    );

    setError("");
  } catch (err) {
    console.error("Update Appointment Error:", err);
    setError(err.message || "Could not update appointment.");
  }
};


console.log("Selected date:", filterDate);
console.log(
  "Appointment dates:",
  appointments.map((appointment) => ({
    title: appointment.title,
    date: appointment.appointment_date,
    status: appointment.status,
  }))
);

const filteredAppointments = appointments.filter((appointment) => {
  // Search only after clicking the Search button
  const search = appliedSearch.trim().toLowerCase();

  const title = String(appointment.title || "").trim().toLowerCase();
  const doctor = String(appointment.doctor || "").trim().toLowerCase();
  const location = String(appointment.location || "").trim().toLowerCase();

  const matchesSearch =
    search === "" ||
    title.includes(search) ||
    doctor.includes(search) ||
    location.includes(search);

  // Compare dates in YYYY-MM-DD format
  const appointmentDate = appointment.appointment_date
    ? String(appointment.appointment_date).slice(0, 10)
    : "";

  const matchesDate =
    !filterDate || appointmentDate === filterDate;

  // Match selected status
  const matchesStatus =
    filterStatus === "All" ||
    appointment.status === filterStatus;

  return matchesSearch && matchesDate && matchesStatus;
});

  useEffect(() => {
    loadAppointments();
  }, []);

  return (
    <div className="appointment-page">

      {/* SIDEBAR */}
      <aside className="appointment-sidebar">

        <Link to="/dashboard" className="appointment-brand">
          <div className="appointment-brand-icon">
            🛡️
          </div>

          <span>
            Health<span>Vault</span>
          </span>
        </Link>

        <nav className="appointment-nav">

          <p className="appointment-nav-title">
            MAIN MENU
          </p>

          <Link to="/dashboard" className="appointment-nav-item">
            <span>⌂</span>
            Dashboard
          </Link>

          <Link to="/healthprofile" className="appointment-nav-item">
            <span>♡</span>
            Health Profile
          </Link>

          <Link to="/medicalrecords" className="appointment-nav-item">
            <span>▣</span>
            Medical Records
          </Link>

          <Link to="/medicine" className="appointment-nav-item">
            <span>✚</span>
            Medicines
          </Link>

          <Link to="/appoinment" className="appointment-nav-item active">
            <span>◷</span>
            Appointments
          </Link>

          <p className="appointment-nav-title appointment-tools-title">
            TOOLS
          </p>

          <Link to="#" className="appointment-nav-item">
            <span>✦</span>
            AI Health Assistant
          </Link>

          <Link to="#" className="appointment-nav-item">
            <span>⚙</span>
            Settings
          </Link>

        </nav>

        <div className="appointment-sidebar-bottom">

          <Link to="/" className="appointment-home-link">
            <span>↪</span>
            Back to Home
          </Link>

        </div>

      </aside>


      {/* MAIN CONTENT */}
      <main className="appointment-main">

        {/* HEADER */}
        <header className="appointment-header">

          <div>
            <p className="appointment-label">
              HEALTHCARE PLANNING
            </p>

            <h1>
              Appointments
            </h1>

            <p>
              Manage your upcoming and past healthcare appointments.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="appointment-dashboard-button"
          >
            ← Dashboard
          </Link>

        </header>

        {loading && <p>Loading appointments...</p>}
        {error && (
          <p className="appointment-error">{error}</p>
          )}


        {/* TOP BANNER */}
        <section className="appointment-banner">

          <div className="appointment-banner-content">

            <div className="appointment-calendar-icon">
              ◷
            </div>

            <div>

              <span>
                YOUR HEALTHCARE SCHEDULE
              </span>

              <h2>
                Never miss an important appointment.
              </h2>

              <p>
                Keep all your doctor visits organized in one place.
              </p>

            </div>

          </div>

          
          <button
           className="book-appointment-button"
           onClick={() => setShowForm(!showForm)}
          >
            + Book Appointment
          </button>


        </section>


        
{showForm && (
  <section className="appointment-form-section">
    <div className="appointment-section-header">
      <div>
        <span>NEW BOOKING</span>
        <h2>Book an Appointment</h2>
      </div>

      <button
        type="button"
        onClick={() => setShowForm(false)}
      >
        ×
      </button>
    </div>

    <form onSubmit={addAppointment}>
      <div className="appointment-form-grid">
        <div>
          <label>Appointment Title</label>
          <input
            type="text"
            placeholder="e.g. General Checkup"
            value={newAppointment.title}
            onChange={(e) =>
              setNewAppointment({
                ...newAppointment,
                title: e.target.value,
              })
            }
            required
          />
        </div>

        <div>
          <label>Doctor Name</label>
          <input
            type="text"
            placeholder="e.g. Dr. Kumar"
            value={newAppointment.doctor}
            onChange={(e) =>
              setNewAppointment({
                ...newAppointment,
                doctor: e.target.value,
              })
            }
            required
          />
        </div>

        <div>
          <label>Hospital / Clinic</label>
          <input
            type="text"
            placeholder="Enter hospital or clinic"
            value={newAppointment.location}
            onChange={(e) =>
              setNewAppointment({
                ...newAppointment,
                location: e.target.value,
              })
            }
            required
          />
        </div>

        <div>
          <label>Appointment Date</label>
          <input
            type="date"
            value={newAppointment.appointment_date}
            min={new Date().toLocaleDateString("en-CA")}
            onChange={(e) =>
              setNewAppointment({
                ...newAppointment,
                appointment_date: e.target.value,
              })
            }
            required
          />
        </div>

        <div>
          <label>Appointment Time</label>
          <input
            type="time"
            value={newAppointment.appointment_time}
            onChange={(e) =>
              setNewAppointment({
                ...newAppointment,
                appointment_time: e.target.value,
              })
            }
            required
          />
        </div>
      </div>

      <button type="submit" className="book-appointment-button">
        Save Appointment
      </button>
    </form>
  </section>
)}

{/* SEARCH AND FILTERS */}
<section className="appointment-filters">
  <div className="appointment-search-box">
  <span>⌕</span>
  <input
    type="search"
    placeholder="Search doctor, appointment, or hospital..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        setAppliedSearch(searchTerm);
      }
    }}
  />
  <button
    type="button"
    className="appointment-search-button"
    onClick={() => setAppliedSearch(searchTerm)}
  >
    Search
  </button>
</div>



<div className="appointment-filter-field">
  <label htmlFor="appointment-filter-date">Date</label>
  <input
    id="appointment-filter-date"
    type="date"
    value={filterDate}
    onChange={(e) => setFilterDate(e.target.value)}
  />
</div>


  <div className="appointment-filter-field">
    <label htmlFor="appointment-filter-status">Status</label>
    <select
      id="appointment-filter-status"
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
    >
      <option value="All">All statuses</option>
      <option value="Upcoming">Upcoming</option>
      <option value="Completed">Completed</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  </div>

  <button
    type="button"
    className="appointment-reset-filters"
    onClick={() => {
      setSearchTerm("");
      setAppliedSearch("");
      setFilterDate("");
      setFilterStatus("All");
    }}
  >
    Reset
  </button>
</section>

{/* SUMMARY CARDS */}
<section className="appointment-summary">

  {/* UPCOMING */}
  <div className="appointment-summary-card">
    <span>UPCOMING</span>
    <strong>
      {appointments.filter(
        (appointment) => appointment.status === "Upcoming"
      ).length}
    </strong>
  </div>

  {/* THIS MONTH */}
  <div className="appointment-summary-card">
    <span>THIS MONTH</span>
    <strong>
      {appointments.filter((appointment) => {
        if (!appointment.appointment_date) return false;

        const dateString = String(
          appointment.appointment_date
        ).slice(0, 10);

        const [year, month, day] = dateString.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        const today = new Date();

        return (
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth()
        );
      }).length}
    </strong>
  </div>

  {/* COMPLETED */}
  <div className="appointment-summary-card">
    <span>COMPLETED</span>
    <strong>
      {appointments.filter(
        (appointment) => appointment.status === "Completed"
      ).length}
    </strong>
  </div>

  {/* CANCELLED */}
  <div className="appointment-summary-card">
    <span>CANCELLED</span>
    <strong>
      {appointments.filter(
        (appointment) => appointment.status === "Cancelled"
      ).length}
    </strong>
  </div>

</section>


        {/* UPCOMING APPOINTMENTS */}
        <section className="appointment-section">

          <div className="appointment-section-header">

            <div>
              <span>UPCOMING</span>

              <h2>
                Upcoming Appointments
              </h2>
            </div>

            <button className="appointment-view-button">
              View All →
            </button>

          </div>


          {/* DYNAMIC UPCOMING APPOINTMENTS */}

{filteredAppointments
  .filter(appointment => appointment.status === "Upcoming")
  .map((appointment) => {

    const [day, month, year] = appointment.date.split(" ");

    return (
      <div
        className="appointment-card"
        key={appointment.id}
      >

        <div className="appointment-date">

          <span>
            {month.toUpperCase()}
          </span>

          <strong>
            {day}
          </strong>

          <small>
            {new Date(
              `${month} ${day}, ${year}`
            )
              .toLocaleDateString("en-US", {
                weekday: "short"
              })
              .toUpperCase()}
          </small>

        </div>


        <div className="appointment-doctor-icon">
          👨‍⚕️
        </div>


        <div className="appointment-doctor-info">

          <h3>
            {appointment.title}
          </h3>

          <p>
            {appointment.doctor}
          </p>

          <span>
            🏥 {appointment.location}
          </span>

        </div>


        <div className="appointment-time">

          <span>
            TIME
          </span>

          <strong>
            {appointment.time}
          </strong>

        </div>


         <span className="appointment-status">
          {appointment.status}
         </span>
         <div className="appointment-actions">
          <button
          type="button"
          className="complete-appointment-button"
          onClick={() =>
            updateAppointmentStatus(appointment.id, "Completed")
          }
          >
            Complete
          </button>

          <button
          type="button"
          className="cancel-appointment-button"
          onClick={() =>
            updateAppointmentStatus(appointment.id, "Cancelled")
          }
          >
            Cancel
          </button>
</div>

      </div>
    );

  })}

        </section>


        {/* PAST APPOINTMENTS */}
        <section className="appointment-section">

          <div className="appointment-section-header">

            <div>
              <span>HISTORY</span>

              <h2>
                Recent Appointments
              </h2>
            </div>

          </div>


          {filteredAppointments
  .filter(appointment => appointment.status === "Completed")
  .map((appointment) => (

    <div
      className="past-appointment"
      key={appointment.id}
    >

      <div className="past-icon">
        ✓
      </div>

      <div className="past-info">

        <h3>
          {appointment.title}
        </h3>

        <p>
          {appointment.doctor} · {appointment.location}
        </p>

      </div>

      <div className="past-date">
        {appointment.date}
      </div>

      <span className="completed-badge">
        {appointment.status}
      </span>

    </div>

  ))}

        </section>


                {/* CANCELLED APPOINTMENTS */}
        <section className="appointment-section">

          <div className="appointment-section-header">
            <div>
              <span>CANCELLED</span>
              <h2>Cancelled Appointments</h2>
            </div>
          </div>

        {filteredAppointments
        .filter(appointment => appointment.status === "Cancelled")
        .length === 0 ? (
        <p className="no-cancelled-appointments">
          No cancelled appointments.
        </p>
        ) : (
          filteredAppointments
          .filter(
            (appointment) => appointment.status === "Cancelled"
          )

              .map((appointment) => (
                <div
                  className="cancelled-appointment"
                  key={appointment.id}
                >
                  <div className="cancelled-icon">
                    ×
                  </div>

                  <div className="cancelled-info">
                    <h3>{appointment.title}</h3>
                    <p>
                      {appointment.doctor} · {appointment.location}
                    </p>
                  </div>

                  <div className="cancelled-date">
                    {appointment.date}
                  </div>

                  <span className="cancelled-badge">
                    Cancelled
                  </span>
                </div>
              ))
          )}

        </section>


        {/* SECURITY NOTE */}
        <div className="appointment-security-note">

          <span>🛡️</span>

          <p>
            Appointment information is kept organized for your personal
            reference. Always confirm appointment details with your provider.
          </p>

        </div>

      </main>

    </div>
  );
}

export default Appointment;