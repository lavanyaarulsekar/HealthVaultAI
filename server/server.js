import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import OpenAI from "openai";
import pg from "pg";
import { GoogleGenAI } from "@google/genai";

dotenv.config({ path: "./.env" });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("PostgreSQL connection failed:", err);
  } else {
    console.log("PostgreSQL connected successfully!");
  }
});

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("HealthVault AI Server is running!");
});


app.get("/api/health-profile", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM health_profiles ORDER BY id DESC LIMIT 1"
    );

    if (result.rows.length === 0) {
      return res.json(null);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Health Profile Error:", error);

    res.status(500).json({
      error: "Unable to fetch health profile.",
    });
  }
});




app.post("/api/health-profile", async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      blood_group,
      height,
      weight,
      phone,
      emergency_contact,
      emergency_phone,
      email,
      date_of_birth,
      allergies,
      medical_conditions,
      emergency_relationship,
    } = req.body;

    const existing = await pool.query(
      "SELECT id FROM health_profiles ORDER BY id DESC LIMIT 1"
    );

    let result;

    const values = [
      name ?? null,
      age ?? null,
      gender ?? null,
      blood_group ?? null,
      height ?? null,
      weight ?? null,
      phone ?? null,
      emergency_contact ?? null,
      emergency_phone ?? null,
      email ?? null,
      date_of_birth || null,
      allergies ?? null,
      medical_conditions ?? null,
      emergency_relationship ?? null,
    ];

    if (existing.rows.length > 0) {
      result = await pool.query(
        `UPDATE health_profiles SET
          name = $1,
          age = $2,
          gender = $3,
          blood_group = $4,
          height = $5,
          weight = $6,
          phone = $7,
          emergency_contact = $8,
          emergency_phone = $9,
          email = $10,
          date_of_birth = $11,
          allergies = $12,
          medical_conditions = $13,
          emergency_relationship = $14,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $15
        RETURNING *`,
        [...values, existing.rows[0].id]
      );
    } else {
      result = await pool.query(
        `INSERT INTO health_profiles (
          name, age, gender, blood_group, height, weight,
          phone, emergency_contact, emergency_phone, email,
          date_of_birth, allergies, medical_conditions,
          emergency_relationship
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14
        ) RETURNING *`,
        values
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Health Profile Save Error:", error);

    res.status(500).json({
      error: "Unable to save health profile.",
    });
  }
});


app.post("/api/summarize", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No medical record uploaded.",
      });
    }

    console.log("Received file:", req.file.originalname);

    const prompt = `
Analyze this medical record and create a simple patient-friendly summary.

Return the answer in this structure:

RECORD TYPE:
DATE:
KEY FINDINGS:
- finding 1
- finding 2
- finding 3

IMPORTANT:
- This summary is for understanding the record and is not a medical diagnosis.
- Do not invent information that is not present in the medical record.
- If the date or record type is unclear, say "Not specified".
- Explain medical terms in simple language where helpful.
- Do not recommend changing prescribed medicines or treatment.
`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: req.file.mimetype,
                data: req.file.buffer.toString("base64"),
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    const summary = response.text;

    if (!summary) {
      throw new Error("Gemini returned an empty summary.");
    }

    console.log("AI summary generated.");

    res.json({ summary });
  } catch (error) {
    console.error("Medical Summarization Error:", error);

    res.status(500).json({
      error:
        "Unable to summarize the medical record. Please check the backend terminal for details.",
    });
  }
});



/* MEDICAL RECORDS API */

// Get all medical records
app.get("/api/medical-records", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description, category,
              TO_CHAR(record_date, 'Mon DD YYYY') AS date,
              file_name, file_type, created_at
       FROM medical_records
       ORDER BY id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Fetch Medical Records Error:", error);
    res.status(500).json({ error: "Unable to fetch medical records." });
  }
});

// Add a medical record
app.post("/api/medical-records", async (req, res) => {
  try {
    const { name, description, category, date } = req.body;

    if (!name || !description || !category || !date) {
      return res.status(400).json({
        error: "Name, description, category and date are required."
      });
    }

    const result = await pool.query(
      `INSERT INTO medical_records
       (name, description, category, record_date)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, description, category,
                 TO_CHAR(record_date, 'Mon DD YYYY') AS date,
                 file_name, file_type, created_at`,
      [name, description, category, date]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Add Medical Record Error:", error);
    res.status(500).json({ error: "Unable to save medical record." });
  }
});

// Delete a medical record
app.delete("/api/medical-records/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM medical_records WHERE id = $1 RETURNING id",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Medical record not found." });
    }

    res.json({ message: "Medical record deleted successfully." });
  } catch (error) {
    console.error("Delete Medical Record Error:", error);
    res.status(500).json({ error: "Unable to delete medical record." });
  }
});


// ===============================
// MEDICINES API
// ===============================

// Get all medicines
app.get("/api/medicines", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM medicines ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Fetch Medicines Error:", error);
    res.status(500).json({ error: "Unable to fetch medicines." });
  }
});

// Add a medicine
app.post("/api/medicines", async (req, res) => {
  try {
    const { name, dosage, frequency, time, period, status } = req.body;

    if (!name || !dosage || !frequency) {
      return res.status(400).json({
        error: "Name, dosage and frequency are required."
      });
    }

    const result = await pool.query(
      `INSERT INTO medicines
        (name, dosage, frequency, schedule_time, period, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        name,
        dosage,
        frequency,
        time || "09:00 AM",
        period || "Morning",
        status || "Pending"
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Add Medicine Error:", error);
    res.status(500).json({ error: "Unable to save medicine." });
  }
});

// Update medicine status
app.patch("/api/medicines/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Taken", "Pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid medicine status." });
    }

    const result = await pool.query(
      `UPDATE medicines
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Medicine not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update Medicine Error:", error);
    res.status(500).json({ error: "Unable to update medicine status." });
  }
});

// Delete a medicine
app.delete("/api/medicines/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM medicines WHERE id = $1 RETURNING id",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Medicine not found." });
    }

    res.json({ message: "Medicine deleted successfully." });
  } catch (error) {
    console.error("Delete Medicine Error:", error);
    res.status(500).json({ error: "Unable to delete medicine." });
  }
});

app.get("/api/appointments", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        appointments.*,
        TO_CHAR(appointments.appointment_date, 'YYYY-MM-DD') AS formatted_date
      FROM appointments
      ORDER BY appointments.appointment_date ASC, appointments.id DESC
    `);

    const appointments = result.rows.map((appointment) => ({
      ...appointment,
      appointment_date: appointment.formatted_date,
    }));

    res.json(appointments);
  } catch (error) {
    console.error("Get Appointments Error:", error);
    res.status(500).json({
      error: "Failed to fetch appointments.",
    });
  }
});


app.post("/api/appointments", async (req, res) => {
  try {
    const {
      title,
      doctor,
      location,
      appointment_date,
      appointment_time,
      status,
    } = req.body;

    if (
      !title?.trim() ||
      !doctor?.trim() ||
      !location?.trim() ||
      !appointment_date ||
      !appointment_time
    ) {
      return res.status(400).json({
        error: "Please provide all required appointment details.",
      });
    }

    const result = await pool.query(
      `INSERT INTO appointments
       (title, doctor, location, appointment_date, appointment_time, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        title.trim(),
        doctor.trim(),
        location.trim(),
        appointment_date,
        appointment_time,
        status || "Upcoming",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Add Appointment Error:", error);
    res.status(500).json({ error: "Failed to save appointment." });
  }
});

app.delete("/api/appointments/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM appointments WHERE id = $1 RETURNING id",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    res.json({ message: "Appointment deleted successfully." });
  } catch (error) {
    console.error("Delete Appointment Error:", error);
    res.status(500).json({ error: "Failed to delete appointment." });
  }
});

app.patch("/api/appointments/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Upcoming", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid appointment status." });
    }

    const result = await pool.query(
      `UPDATE appointments
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update Appointment Error:", error);
    res.status(500).json({ error: "Failed to update appointment status." });
  }
});


/* ==============================
   HEALTH TIMELINE API
============================== */

// GET: Fetch all timeline events
app.get("/api/health-timeline", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        title,
        description,
        type,
        TO_CHAR(event_date, 'Month DD, YYYY') AS date,
        created_at
      FROM health_timeline
      ORDER BY event_date DESC, created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Get Health Timeline Error:", error);
    res.status(500).json({ error: "Failed to fetch timeline events." });
  }
});

// POST: Add a timeline event
app.post("/api/health-timeline", async (req, res) => {
  try {
    const { id, title, description, type, date } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Event title is required." });
    }

    const eventDate = date ? new Date(date) : new Date();

    if (Number.isNaN(eventDate.getTime())) {
      return res.status(400).json({ error: "Invalid event date." });
    }

    const result = await pool.query(
      `INSERT INTO health_timeline
        (id, title, description, type, event_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING
         id, title, description, type,
         TO_CHAR(event_date, 'Month DD, YYYY') AS date,
         created_at`,
      [
        id || Date.now(),
        title.trim(),
        description || "",
        type || "Checkup",
        eventDate.toISOString().slice(0, 10),
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Add Health Timeline Event Error:", error);
    res.status(500).json({ error: "Failed to save timeline event." });
  }
});

// DELETE: Remove a timeline event
app.delete("/api/health-timeline/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM health_timeline WHERE id = $1 RETURNING id",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Timeline event not found." });
    }

    res.json({ message: "Timeline event deleted successfully." });
  } catch (error) {
    console.error("Delete Health Timeline Event Error:", error);
    res.status(500).json({ error: "Failed to delete timeline event." });
  }
});


app.post("/api/assistant", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Please enter a message.",
      });
    }

    const conversationHistory = Array.isArray(history)
      ? history
          .filter(
            (item) =>
              ["user", "assistant"].includes(item.role) &&
              typeof item.content === "string"
          )
          .slice(-10)
          .map((item) => ({
            role: item.role === "assistant" ? "model" : "user",
            parts: [{ text: item.content }],
          }))
      : [];

    const chat = gemini.chats.create({
      model: "gemini-3.8-flash",
      history: conversationHistory,
      config: {
        systemInstruction: `
You are HealthVault AI, a friendly assistant that provides
general health information and helps users organize health records.

Do not diagnose conditions, prescribe medicines, or recommend
changing prescribed doses. Encourage users to consult a qualified
healthcare professional for personal medical concerns.
For emergencies, advise users to contact local emergency services.
Do not claim to have accessed health records unless provided.
        `,
      },
    });

    const response = await chat.sendMessage({
      message: message.trim(),
    });

    res.json({
      reply: response.text || "I couldn't generate a response. Please try again.",
    });
  } catch (error) {
    console.error("Gemini AI Assistant Error:", error);

    res.status(500).json({
      error:
        error.status === 429
          ? "Gemini usage limit reached. Please check your Google AI Studio quota."
          : "Unable to generate a response. Check the backend terminal for details.",
    });
  }
});


/* EMERGENCY CARD API */

// Get Emergency Card information
app.get("/api/emergency-card", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        blood_group,
        allergies,
        medical_conditions,
        current_medications,
        emergency_contact,
        emergency_phone
      FROM health_profiles
      ORDER BY id DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.json({
        bloodGroup: "",
        allergies: "",
        conditions: "",
        medications: "",
        contactName: "",
        contactPhone: "",
      });
    }

    const row = result.rows[0];

    res.json({
      bloodGroup: row.blood_group || "",
      allergies: row.allergies || "",
      conditions: row.medical_conditions || "",
      medications: row.current_medications || "",
      contactName: row.emergency_contact || "",
      contactPhone: row.emergency_phone || "",
    });
  } catch (error) {
    console.error("Emergency Card Fetch Error:", error);
    res.status(500).json({
      error: "Unable to fetch emergency information.",
    });
  }
});

// Save Emergency Card information
app.post("/api/emergency-card", async (req, res) => {
  try {
    const {
      bloodGroup = "",
      allergies = "",
      conditions = "",
      medications = "",
      contactName = "",
      contactPhone = "",
    } = req.body || {};

    const existing = await pool.query(
      "SELECT id FROM health_profiles ORDER BY id DESC LIMIT 1"
    );

    let result;

    const values = [
      bloodGroup,
      allergies,
      conditions,
      medications,
      contactName,
      contactPhone,
    ];

    if (existing.rows.length > 0) {
      result = await pool.query(
        `UPDATE health_profiles SET
          blood_group = $1,
          allergies = $2,
          medical_conditions = $3,
          current_medications = $4,
          emergency_contact = $5,
          emergency_phone = $6,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING
          blood_group, allergies, medical_conditions,
          current_medications, emergency_contact, emergency_phone`,
        [...values, existing.rows[0].id]
      );
    } else {
      result = await pool.query(
        `INSERT INTO health_profiles (
          blood_group, allergies, medical_conditions,
          current_medications, emergency_contact, emergency_phone
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
          blood_group, allergies, medical_conditions,
          current_medications, emergency_contact, emergency_phone`,
        values
      );
    }

    const row = result.rows[0];

    res.json({
      message: "Emergency information saved successfully.",
      bloodGroup: row.blood_group || "",
      allergies: row.allergies || "",
      conditions: row.medical_conditions || "",
      medications: row.current_medications || "",
      contactName: row.emergency_contact || "",
      contactPhone: row.emergency_phone || "",
    });
  } catch (error) {
    console.error("Emergency Card Save Error:", error);
    res.status(500).json({
      error: "Unable to save emergency information.",
    });
  }
});


/* SETTINGS API */

// Get saved settings
app.get("/api/settings", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM healthvault_settings WHERE id = 1"
    );

    const row = result.rows[0];

    if (!row) {
      return res.status(404).json({
        error: "Settings record not found.",
      });
    }

    res.json({
      fullName: row.full_name,
      email: row.email,
      twoFactor: row.two_factor,
      appointmentReminders: row.appointment_reminders,
      medicineReminders: row.medicine_reminders,
    });
  } catch (error) {
    console.error("Settings Fetch Error:", error);
    res.status(500).json({
      error: "Unable to fetch settings.",
    });
  }
});

// Save settings
app.put("/api/settings", async (req, res) => {
  try {
    const {
      fullName = "",
      email = "",
      twoFactor = false,
      appointmentReminders = true,
      medicineReminders = true,
    } = req.body || {};

    const result = await pool.query(
      `UPDATE healthvault_settings SET
        full_name = $1,
        email = $2,
        two_factor = $3,
        appointment_reminders = $4,
        medicine_reminders = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING *`,
      [
        fullName,
        email,
        Boolean(twoFactor),
        Boolean(appointmentReminders),
        Boolean(medicineReminders),
      ]
    );

    const row = result.rows[0];

    res.json({
      message: "Settings saved successfully.",
      fullName: row.full_name,
      email: row.email,
      twoFactor: row.two_factor,
      appointmentReminders: row.appointment_reminders,
      medicineReminders: row.medicine_reminders,
    });
  } catch (error) {
    console.error("Settings Save Error:", error);
    res.status(500).json({
      error: "Unable to save settings.",
    });
  }
});

// Reset settings to defaults
app.post("/api/settings/reset", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE healthvault_settings SET
        full_name = '',
        email = '',
        two_factor = FALSE,
        appointment_reminders = TRUE,
        medicine_reminders = TRUE,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING *`
    );

    const row = result.rows[0];

    res.json({
      message: "Settings reset successfully.",
      fullName: row.full_name,
      email: row.email,
      twoFactor: row.two_factor,
      appointmentReminders: row.appointment_reminders,
      medicineReminders: row.medicine_reminders,
    });
  } catch (error) {
    console.error("Settings Reset Error:", error);
    res.status(500).json({
      error: "Unable to reset settings.",
    });
  }
});


app.listen(5000, () => {
  console.log("HealthVault AI Server running on port 5000");
});