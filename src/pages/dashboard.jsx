import { Link } from "react-router-dom";
import "./dashboard.css";
import { medicalRecords, appointments } from "../data/healthdata";

function Dashboard() {
  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <Link to="/" className="dashboard-brand">

          <div className="brand-icon">
            🛡️
          </div>

          <span>
            Health<span>Vault</span>
          </span>

        </Link>


        {/* NAVIGATION */}
        <nav className="sidebar-nav">

          <p className="nav-title">
            MAIN MENU
          </p>

          <Link to="/dashboard" className="nav-item active">
            <span>⌂</span>
            Dashboard
          </Link>

          <Link to="/healthprofile" className="nav-item">
             <span>♡</span>
             Health Profile
          </Link>

          <Link to="/medicalrecords" className="nav-item">
             <span>▣</span>
             Medical Records
          </Link>

           <Link to="/healthtimeline" className="nav-item">
            <span>◉</span>
            Health Timeline
          </Link>

          <Link to="/medicine" className="nav-item">
            <span>✚</span>
            Medicines
          </Link>

          <Link to="/appoinment" className="nav-item">
            <span>◷</span>
            Appointments
          </Link>


          <p className="nav-title second-title">
            TOOLS
          </p>

          <Link to="/assistant" className="nav-item">
            <span>✦</span>
            AI Health Assistant
          </Link>

          
          <Link to="/summarization" className="nav-item">
             <span className="sidebar-icon">🧾</span>
              AI Medical Summarization
          </Link>



          <Link to="/setting" className="nav-item">
            <span>⚙</span>
            Settings
          </Link>

         

        </nav>


        {/* SIDEBAR BOTTOM */}
        <div className="sidebar-bottom">

          <Link to="/" className="logout">
            <span>↪</span>
            Back to Home
          </Link>

        </div>

      </aside>


      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        {/* TOP BAR */}
        <header className="dashboard-header">

          <div>
            <p className="dashboard-label">
              HEALTH OVERVIEW
            </p>

            <h1>
              Good morning 👋
            </h1>

            <p className="dashboard-subtitle">
              Here's what's happening with your health.
            </p>
          </div>


          <div className="header-actions">

            <button className="notification-btn">
              ♧
            </button>

            <div className="profile-mini">

              <div className="profile-avatar">
                L
              </div>

              <div>
                <strong>
                  Lavanya
                </strong>

                <span>
                  Member
                </span>
              </div>

            </div>

          </div>

        </header>


        {/* SUMMARY CARDS */}
        <section className="summary-grid">

          <div className="summary-card">

            <div className="summary-icon mint">
              ♡
            </div>

            <div>
              <span>
                Health Score
              </span>

              <strong>
                85
              </strong>

              <small>
                Good health
              </small>
            </div>

          </div>


          <div className="summary-card">

  <div className="summary-icon blue">
    ▣
  </div>

  <div>
    <span>
      Medical Records
    </span>

    <strong>
      {medicalRecords.length}
    </strong>

    <small>
      {medicalRecords.filter(record =>
        record.date.includes("Aug 2026")
      ).length} added this month
    </small>
  </div>

</div>


          <div className="summary-card">

            <div className="summary-icon green">
              ✚
            </div>

            <div>
              <span>
                Medicines
              </span>

              <strong>
                4
              </strong>

              <small>
                2 active medications
              </small>
            </div>

          </div>


          <div className="summary-card">

            <div className="summary-icon gold">
              ◷
            </div>

            <div>
              <span>
                Appointments
              </span>

              <strong>
                2
              </strong>

              <small>
                Upcoming
              </small>
            </div>

          </div>

        </section>


       {/* CONTENT GRID */}
<section className="dashboard-grid">

  {/* HEALTH OVERVIEW */}
  <div className="dashboard-card health-overview">

    <div className="card-heading">

      <div>
        <span>
          HEALTH ACTIVITY
        </span>

        <h2>
          Medical record activity
        </h2>
      </div>

      <select>
        <option>
          This year
        </option>

        <option>
          This month
        </option>
      </select>

    </div>


    {/* MEDICAL RECORD ACTIVITY CHART */}
    <div className="health-chart">

      <div className="chart-bars">

        {/* JULY */}
        <div className="chart-bar-group">

          <div
            className="chart-bar"
            style={{
              height: `${Math.max(
                medicalRecords.filter(record =>
                  record.date.includes("Jul 2026")
                ).length * 60,
                10
              )}px`
            }}
          ></div>

          <span>
            Jul
          </span>

        </div>


        {/* AUGUST */}
        <div className="chart-bar-group">

          <div
            className="chart-bar"
            style={{
              height: `${Math.max(
                medicalRecords.filter(record =>
                  record.date.includes("Aug 2026")
                ).length * 60,
                10
              )}px`
            }}
          ></div>

          <span>
            Aug
          </span>

        </div>


        {/* SEPTEMBER */}
        <div className="chart-bar-group">

          <div
            className="chart-bar"
            style={{
              height: `${Math.max(
                medicalRecords.filter(record =>
                  record.date.includes("Sep 2026")
                ).length * 60,
                10
              )}px`
            }}
          ></div>

          <span>
            Sep
          </span>

        </div>


        {/* OCTOBER */}
        <div className="chart-bar-group">

          <div
            className="chart-bar"
            style={{
              height: `${Math.max(
                medicalRecords.filter(record =>
                  record.date.includes("Oct 2026")
                ).length * 60,
                10
              )}px`
            }}
          ></div>

          <span>
            Oct
          </span>

        </div>

      </div>

    </div>

  </div>


  {/* UPCOMING APPOINTMENTS */}
  <div className="dashboard-card upcoming-card">

    <div className="card-heading">

      <div>
        <span>
          UPCOMING
        </span>

        <h2>
          Appointments
        </h2>
      </div>

      <button>
        +
      </button>

    </div>


    {/* DYNAMIC APPOINTMENTS */}
    {appointments
      .filter(appointment => appointment.status === "Upcoming")
      .slice(0, 2)
      .map((appointment) => {

        const [day, month] = appointment.date.split(" ");

        return (
          <div
            className="appointment"
            key={appointment.id}
          >

            <div className="appointment-date">

              <strong>
                {day}
              </strong>

              <span>
                {month.toUpperCase()}
              </span>

            </div>


            <div>

              <strong>
                {appointment.title}
              </strong>

              <span>
                {appointment.doctor} • {appointment.time}
              </span>

            </div>

          </div>
        );

      })}

  </div>

</section>


        {/* RECENT RECORDS */}
        <section className="dashboard-card records-card">

          <div className="card-heading">

            <div>
              <span>
                HEALTH RECORDS
              </span>

              <h2>
                Recent medical records
              </h2>
            </div>

            <Link to="#">
              View all →
            </Link>

          </div>


          {/* RECORDS LIST */}

<div className="records-list">

  {medicalRecords.slice(0, 3).map((record) => (

    <div className="record-item" key={record.id}>

      <div className="record-icon">
        ▣
      </div>

      <div className="record-info">

        <strong>
          {record.name}
        </strong>

        <span>
          {record.description} • {record.date}
        </span>

      </div>

      <span className="record-status">
        Available
      </span>

      <span className="record-arrow">
        →
      </span>

    </div>

  ))}

</div>

</section>


        {/* AI ASSISTANT */}
        <section className="ai-banner">

          <div className="ai-icon">
            ✦
          </div>

          <div>

            <span>
              HEALTHVAULT AI
            </span>

            <h2>
              Have a question about your health?
            </h2>

            <p>
              Ask your AI health assistant about your records,
              medicines, or general health information.
            </p>

          </div>

          <button>
            Ask AI →
          </button>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;