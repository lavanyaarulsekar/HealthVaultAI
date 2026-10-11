import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./healthtimeline.css";

const defaultEvents = [
{
id: 1,
date: "January 15, 2026",
title: "General Health Checkup",
description:
"Routine health checkup completed. Blood pressure and basic health measurements were recorded.",
type: "Checkup",
icon: "🩺",
},
{
id: 2,
date: "February 02, 2026",
title: "New Medication Added",
description:
"A new medicine was added to your medication schedule.",
type: "Medicine",
icon: "💊",
},
{
id: 3,
date: "March 10, 2026",
title: "Medical Record Added",
description:
"A new medical document was uploaded to your HealthVault.",
type: "Medical Record",
icon: "📄",
},
{
id: 4,
date: "Today",
title: "AI Health Analysis",
description:
"Your health information was analyzed by the AI Health Assistant.",
type: "AI Insight",
icon: "🤖",
},
];

function HealthTimeline() {
const [events, setEvents] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");


const [filter, setFilter] = useState("All");
const [searchTerm, setSearchTerm] = useState("");
const [showForm, setShowForm] = useState(false);


  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "Checkup",
  });

  // PASTE STEP 4.3 HERE
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/health-timeline"
        );

        if (!response.ok) {
          throw new Error("Failed to load timeline events.");
        }

        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Health Timeline Error:", err);
        setError("Could not load events. Please check your backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);



const handleAddEvent = async (e) => {
  e.preventDefault();

  if (!newEvent.title.trim()) {
    return;
  }

  try {
    setError("");

    const response = await fetch(
      "http://localhost:5000/api/health-timeline",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Date.now(),
          title: newEvent.title.trim(),
          description: newEvent.description,
          type: newEvent.type,
          date: new Date().toISOString().slice(0, 10),
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save the event.");
    }

    const savedEvent = await response.json();

    setEvents((previousEvents) => [
      savedEvent,
      ...previousEvents,
    ]);

    setNewEvent({
      title: "",
      description: "",
      type: "Checkup",
    });

    setShowForm(false);
  } catch (err) {
    console.error("Save Health Event Error:", err);
    setError("Could not save event. Please check your backend.");
  }
};





const deleteEvent = async (id) => {
  try {
    setError("");

    const response = await fetch(
      `http://localhost:5000/api/health-timeline/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete the event.");
    }

    setEvents((previousEvents) =>
      previousEvents.filter((event) => event.id !== id)
    );
  } catch (err) {
    console.error("Delete Health Event Error:", err);
    setError("Could not delete event. Please try again.");
  }
};


const filteredEvents = events
  .filter((event) => {
    const matchesCategory =
      filter === "All" || event.type === filter;

    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !search ||
      (event.title || "").toLowerCase().includes(search) ||
      (event.description || "").toLowerCase().includes(search) ||
      (event.type || "").toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  })
  .sort((a, b) => {
    const getDate = (event) => {
      if (event.date === "Today") {
        return new Date().setHours(0, 0, 0, 0);
      }

      const parsed = new Date(event.date).getTime();

      return Number.isNaN(parsed) ? 0 : parsed;
    };

    return getDate(b) - getDate(a);
  });


return ( <div className="timeline-page">

```
  {/* SIDEBAR */}
  <aside className="timeline-sidebar">

    <Link to="/dashboard" className="timeline-brand">
      <div className="timeline-brand-icon">
        🛡️
      </div>

      <span>
        Health<span>Vault</span>
      </span>
    </Link>

    <nav className="timeline-nav">

      <p className="timeline-nav-title">
        MAIN MENU
      </p>

      <Link
        to="/dashboard"
        className="timeline-nav-item"
      >
        <span>⌂</span>
        Dashboard
      </Link>

      <Link
        to="/healthprofile"
        className="timeline-nav-item"
      >
        <span>♡</span>
        Health Profile
      </Link>

      <Link
        to="/medicalrecords"
        className="timeline-nav-item"
      >
        <span>▣</span>
        Medical Records
      </Link>

      <Link
        to="/medicine"
        className="timeline-nav-item"
      >
        <span>✚</span>
        Medicines
      </Link>

      <Link
        to="/appoinment"
        className="timeline-nav-item"
      >
        <span>◷</span>
        Appointments
      </Link>

      <p className="timeline-nav-title timeline-tools-title">
        TOOLS
      </p>

      <Link
        to="/assistant"
        className="timeline-nav-item"
      >
        <span>✦</span>
        AI Health Assistant
      </Link>

      <Link
        to="/setting"
        className="timeline-nav-item"
      >
        <span>⚙</span>
        Settings
      </Link>

      <Link
        to="/healthtimeline"
        className="timeline-nav-item active"
      >
        <span>◉</span>
        Health Timeline
      </Link>

    </nav>

    <div className="timeline-sidebar-bottom">

      <Link
        to="/"
        className="timeline-home-link"
      >
        <span>↪</span>
        Back to Home
      </Link>

    </div>

  </aside>

  {/* MAIN CONTENT */}
  <main className="timeline-main">

    {/* HEADER */}
    <header className="timeline-header">

      <div>
        <span className="timeline-label">
          HEALTH JOURNEY
        </span>

        <h1>
          Health Timeline
        </h1>

        <p>
          Your complete health journey in one place.
        </p>
      </div>

      <Link
        to="/dashboard"
        className="timeline-back-button"
      >
        ← Dashboard
      </Link>

    </header>

    {/* SUMMARY */}
    <section className="timeline-summary">

      <div className="timeline-summary-card">
        <span className="summary-icon">🩺</span>

        <div>
          <strong>{events.length}</strong>
          <p>Total Events</p>
        </div>
      </div>

      <div className="timeline-summary-card">
        <span className="summary-icon">📄</span>

        <div>
          <strong>
            {
              events.filter(
                (event) =>
                  event.type === "Medical Record"
              ).length
            }
          </strong>
          <p>Medical Records</p>
        </div>
      </div>

      <div className="timeline-summary-card">
        <span className="summary-icon">💊</span>

        <div>
          <strong>
            {
              events.filter(
                (event) =>
                  event.type === "Medicine"
              ).length
            }
          </strong>
          <p>Medicine Events</p>
        </div>
      </div>

    </section>


{/* TIMELINE SEARCH */}
<div className="timeline-search">
  <span>⌕</span>
  <input
    type="search"
    placeholder="Search health events..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>


    {/* FILTER + ADD */}
    <div className="timeline-controls">

      <div className="timeline-filters">

        {[
          "All",
          "Checkup",
          "Medicine",
          "Medical Record",
          "AI Insight",
        ].map((item) => (
          <button
            key={item}
            className={
              filter === item
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}

      </div>

      <button
        className="add-event-button"
        onClick={() => setShowForm(!showForm)}
      >
        + Add Event
      </button>

    </div>

    {/* ADD EVENT FORM */}
    {showForm && (
      <form
        className="timeline-form"
        onSubmit={handleAddEvent}
      >

        <div className="timeline-form-header">
          <div>
            <span>NEW EVENT</span>
            <h2>Add Health Event</h2>
          </div>

          <button
            type="button"
            className="close-form"
            onClick={() => setShowForm(false)}
          >
            ×
          </button>
        </div>

        <div className="timeline-form-grid">

          <div className="timeline-input-group">
            <label>Event Title</label>

            <input
              type="text"
              placeholder="Example: Blood Test"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div className="timeline-input-group">
            <label>Event Type</label>

            <select
              value={newEvent.type}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  type: e.target.value,
                })
              }
            >
              <option>Checkup</option>
              <option>Medicine</option>
              <option>Medical Record</option>
              <option>AI Insight</option>
            </select>
          </div>

        </div>

        <div className="timeline-input-group">
          <label>Description</label>

          <textarea
            rows="3"
            placeholder="Describe this health event..."
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                description: e.target.value,
              })
            }
          />
        </div>

        <button type="submit" className="save-event-btn">
          Save Event
        </button>

      </form>
    )}

    {/* TIMELINE */}
    <div className="timeline">

      {filteredEvents.length === 0 ? (
        <div className="empty-timeline">
          <div>🗂️</div>
          <h3>No events found</h3>
          <p>
            There are no events in this category yet.
          </p>
        </div>
      ) : (
        filteredEvents.map((event) => (

          <div
            className="timeline-item"
            key={event.id}
          >

            <div className="timeline-dot">
              {event.icon}
            </div>

            <div className="timeline-card">

              <div className="timeline-card-top">

                <span className="timeline-date">
                  {event.date}
                </span>

                <button
                  className="delete-event"
                  onClick={() =>
                    deleteEvent(event.id)
                  }
                  title="Delete event"
                >
                  ×
                </button>

              </div>

              <h3>
                {event.title}
              </h3>

              <p>
                {event.description}
              </p>

              <span className="timeline-tag">
                {event.type}
              </span>

            </div>

          </div>

        ))
      )}

    </div>

  </main>

</div>


);
}

export default HealthTimeline;
