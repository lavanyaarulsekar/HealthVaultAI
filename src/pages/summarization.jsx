
import { useState } from "react";
import "./summarization.css";

function Summarization() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
      setSummary(null);
    }
  };


 const handleSummarize = async () => {

  if (!selectedFile) {
    return;
  }

  setIsSummarizing(true);
  setSummary(null);

  try {

    const formData = new FormData();

    formData.append("file", selectedFile);

    const response = await fetch(
      "http://localhost:5000/api/summarize",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    setSummary({
      recordType: "Medical Record",
      date: new Date().toLocaleDateString(),
      findings: [data.summary],
      note:
        "This is an AI-generated summary for understanding the medical record. It is not a medical diagnosis.",
    });

  } catch (error) {

    console.error("Summarization error:", error);

    alert(
      "Unable to summarize the medical record. Please check that the AI server is running."
    );

  } finally {

    setIsSummarizing(false);

  }
};



  return (
    <div className="summarization-page">

      {/* HEADER */}
      <div className="summary-header">

        <div>

          <span className="summary-label">
            HEALTHVAULT AI
          </span>

          <h1>
            Medical Record Summarization
          </h1>

          <p>
            Turn complex medical reports into simple,
            easy-to-understand information.
          </p>

        </div>

        <div className="summary-ai-icon">
          ✦
        </div>

      </div>


      {/* MAIN CONTENT */}
      <div className="summary-content">

        {/* UPLOAD CARD */}
        <section className="summary-card upload-card">

          <div className="card-title">

            <div className="title-icon">
              📄
            </div>

            <div>
              <span>STEP 1</span>
              <h2>Upload Medical Record</h2>
            </div>

          </div>


          <div className="upload-box">

            <div className="upload-icon">
              ↑
            </div>

            <h3>
              {selectedFile
                ? selectedFile.name
                : "Upload your medical report"}
            </h3>

            <p>
              {selectedFile
                ? "File selected successfully"
                : "Upload a PDF, image, or medical document"}
            </p>


            <input
              type="file"
              id="medical-file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              hidden
            />


            <label
              htmlFor="medical-file"
              className="upload-btn"
            >
              {selectedFile ? "Change File" : "Choose File"}
            </label>


            <small>
              Supported formats: PDF, JPG, PNG
            </small>


            {selectedFile && (

              <button
                className="summarize-btn"
                onClick={handleSummarize}
                disabled={isSummarizing}
              >

                {isSummarizing
                  ? "✦ Analyzing..."
                  : "✦ Summarize with AI"}

              </button>

            )}

          </div>

        </section>


        {/* AI SUMMARY CARD */}
        <section className="summary-card result-card">

          <div className="card-title">

            <div className="title-icon ai">
              ✦
            </div>

            <div>
              <span>STEP 2</span>
              <h2>AI Summary</h2>
            </div>

          </div>


          {/* BEFORE SUMMARY */}
          {!summary && !isSummarizing && (

            <div className="summary-empty">

              <div className="empty-icon">
                ✦
              </div>

              <h3>
                Your summary will appear here
              </h3>

              <p>
                Upload a medical record and let
                HealthVault AI simplify the important
                information for you.
              </p>

            </div>

          )}


          {/* LOADING */}
          {isSummarizing && (

            <div className="summary-empty">

              <div className="empty-icon">
                ✦
              </div>

              <h3>
                Analyzing your record...
              </h3>

              <p>
                HealthVault AI is preparing a simple
                summary of your medical record.
              </p>

            </div>

          )}


          {/* SUMMARY RESULT */}
          {summary && !isSummarizing && (

            <div className="summary-result">

              <div className="result-details">

                <div>
                  <span>RECORD TYPE</span>
                  <strong>{summary.recordType}</strong>
                </div>

                <div>
                  <span>DATE</span>
                  <strong>{summary.date}</strong>
                </div>

              </div>


              <div className="findings-section">

                <h3>
                  Key Findings
                </h3>

                {summary.findings.map((finding, index) => (

                  <div
                    className="finding"
                    key={index}
                  >

                    <span>•</span>

                    <p>
                      {finding}
                    </p>

                  </div>

                ))}

              </div>


              <div className="summary-note">

                <strong>
                  ⚠ Important
                </strong>

                <p>
                  {summary.note}
                </p>

              </div>

            </div>

          )}

        </section>

      </div>


      {/* INFORMATION SECTION */}
      <section className="summary-info">

        <div className="info-icon">
          🛡️
        </div>

        <div>

          <h3>
            Your health information stays protected
          </h3>

          <p>
            AI summarization is designed to help you
            understand your medical records more easily.
            It does not replace professional medical
            advice or diagnosis.
          </p>

        </div>

      </section>

    </div>
  );
}

export default Summarization;
