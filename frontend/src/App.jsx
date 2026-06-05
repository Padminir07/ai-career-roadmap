import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./Login";
import jsPDF from "jspdf";
import "./App.css";

function App() {

  const [user, setUser] = useState(null);
  const [career, setCareer] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();

  }, []);

  const generateRoadmap = async () => {

    if (!career) return;

    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:5000/generate-roadmap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ career }),
        }
      );

      const data = await response.json();

      setRoadmap(data.roadmap);

    } catch (error) {

      console.log(error);

      setRoadmap("❌ Error generating roadmap");

    }

    setLoading(false);

  };

  const downloadPDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("AI Career Roadmap", 20, 20);

    doc.setFontSize(14);

    const lines = doc.splitTextToSize(roadmap, 170);

    doc.text(lines, 20, 40);

    doc.save("roadmap.pdf");

  };

  const logout = async () => {

    await signOut(auth);

  };

  if (!user) {

    return <Login />;

  }

  return (

    <div className="container">

      <button
        className="logout-btn"
        onClick={logout}
      >
        Logout
      </button>

      <h1 className="title">
        AI Career Roadmap 🚀
      </h1>

      <p className="subtitle">
        Your personalized AI mentor
      </p>

      <input
        type="text"
        placeholder="Enter your dream career..."
        value={career}
        onChange={(e) => setCareer(e.target.value)}
        className="input-box"
      />

      <button
        className="btn"
        onClick={generateRoadmap}
      >
        {loading ? "Generating..." : "Generate Roadmap"}
      </button>

      {career && (
        <div className="career-tag">
          👤 {career}
        </div>
      )}

      {roadmap && (

        <div className="roadmap-box">

          <div className="roadmap-content">

            {(() => {

              let stepCount = 0;
              let isConclusion = false;

              return roadmap.split("\n").map((line, index) => {

                const cleanLine = line.trim();

                if (!cleanLine) return null;

                // Remove intro line
                if (
                  cleanLine.startsWith("Here is the roadmap") ||
                  cleanLine.startsWith("Here is a roadmap")
                ) {
                  return null;
                }

                // Conclusion heading
                if (
                  cleanLine === "Conclusion:" ||
                  cleanLine.includes("Conclusion:")
                ) {

                  isConclusion = true;

                  return (
                    <h2
                      key={index}
                      className="conclusion-title"
                    >
                      🌟 Conclusion
                    </h2>
                  );
                }

                // Normal section headings
if (
  cleanLine.endsWith(":") &&
  !cleanLine.includes("Conclusion")
) {

  stepCount = 0;
  isConclusion = false;

  let emoji = "";

  if (cleanLine.includes("Learn")) {
    emoji = "📘 ";
  } else if (cleanLine.includes("Develop")) {
    emoji = "🧠 ";
  } else if (cleanLine.includes("Build")) {
    emoji = "🚀 ";
  } else if (cleanLine.includes("Career")) {
    emoji = "💼 ";
  }

  return (
    <h2
      key={index}
      className="section-title"
    >
      {emoji}{cleanLine}
    </h2>
  );
}



                // Conclusion text
                if (isConclusion) {

                  return (
                    <p
                      key={index}
                      className="conclusion-message"
                    >
                      {cleanLine.replace(/^\d+\.\s*/, "")}
                    </p>
                  );
                }

                const textWithoutNumber =
                  cleanLine.replace(/^\d+\.\s*/, "");

                stepCount++;

                return (

                  <div
                    key={index}
                    className="point-line"
                  >

                    <input type="checkbox" />

                    <span>

                      <span className="step-number">
                        {stepCount}.
                      </span>

                      {" "}

                      {textWithoutNumber}

                    </span>

                  </div>

                );

              });

            })()}

          </div>

          <button
            className="download-btn"
            onClick={downloadPDF}
          >
            📄 Download PDF
          </button>

        </div>

      )}

    </div>

  );

}

export default App;

