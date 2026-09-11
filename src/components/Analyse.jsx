import React, { useEffect, useState } from "react";

export default function CVAnalysisLoader() {
  const [step, setStep] = useState(2);
  const [progress, setProgress] = useState(45);


  useEffect(() => {
    window.scrollTo(0, 0);
    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 3, 92));
    }, 800);

    const stepInterval = setInterval(() => {
    //   setStep((s) => Math.min(s + 1, 3));
    }, 4000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  const steps = [
    {
      title: "Reading your CV",
      text: "Extracting skills, experience, education, achievements and resume structure.",
    },
    {
      title: "Reading job description",
      text: "Analyzing requirements, responsibilities, keywords and role expectations.",
    },
    {
      title: "Matching & scoring",
      text: "Comparing your profile with the job requirements and calculating ATS fit.",
    },
    {
      title: "Generating insights",
      text: "Preparing your ATS score, missing keywords, recommendations and optimized content.",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8F7F3",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0% { transform: scale(.9); opacity:.8; }
          100% { transform: scale(1.15); opacity:0; }
        }

        @keyframes bounce {
          0%,100% { transform:scale(.8); opacity:.7; }
          50% { transform:scale(1.25); opacity:1; }
        }
      `}</style>

    
      {/* CONTENT */}

      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "50px 20px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: "#06b6d4",
              textTransform: "uppercase",
              letterSpacing: 3,
              fontWeight: 900,
              fontSize: 13,
            }}
          >
            AI analysis in progress
          </div>

          <h1
            style={{
              fontSize: "clamp(38px,6vw,70px)",
              fontWeight: 950,
              lineHeight: 0.95,
              letterSpacing: "-0.06em",
              marginBottom: 20,
            }}
          >
            Analyzing your CV and job description
          </h1>

          <p
            style={{
              maxWidth: 700,
              margin: "0 auto",
              color: "#64748b",
              fontSize: 18,
              lineHeight: 1.7,
            }}
          >
            Our AI is reviewing your resume carefully.
            This may take 30–90 seconds depending on
            resume length, job description length and
            analysis complexity.
          </p>

          {/* Spinner */}

          <div
            style={{
              position: "relative",
              width: 130,
              height: 130,
              margin: "40px auto",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: -14,
                borderRadius: "50%",
                border: "1px solid rgba(34,211,238,.25)",
                animation: "pulse 1.8s ease-out infinite",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "12px solid #dff7fb",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "12px solid transparent",
                borderTopColor: "#22d3ee",
                borderRightColor: "#3b82f6",
                animation: "spin 1s linear infinite",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 28,
                borderRadius: "50%",
                background: "white",
                boxShadow: "0 15px 35px rgba(15,23,42,.15)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#06b6d4",
                fontWeight: 900,
                fontSize: 30,
              }}
            >
              CV
            </div>
          </div>
        </div>

        {/* PANEL */}

        <div
          style={{
            background: "white",
            borderRadius: 30,
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            boxShadow: "0 25px 70px rgba(15,23,42,.10)",
          }}
        >
          {/* LEFT */}

          <div style={{ padding: 35 }}>
            {steps.map((item, index) => {
              const status =
                index < step
                  ? "done"
                  : index === step
                  ? "active"
                  : "pending";

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: 15,
                    marginBottom: 25,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center",}}>
                        <div
                        style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border:
                            status === "done"
                            ? "2px solid #3b82f6"
                            : status === "active"
                            ? "2px solid #22d3ee"
                            : "2px solid #cbd5e1",
                        }}
                    >
                        {status === "done" ? (
                        "✓"
                        ) : status === "active" ? (
                        <div
                            style={{
                            width: 9,
                            height: 9,
                            borderRadius: "50%",
                            background: "#22d3ee",
                            animation:
                                "bounce 1.2s infinite",
                            }}
                        />
                        ) : null}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontWeight: 900,
                      }}
                    >
                      {item.title}
                    </div>

                    <div
                      style={{
                        color: "#64748b",
                        marginTop: 5,
                        lineHeight: 1.6,
                      }}
                    >
                      {item.text}
                    </div>
                  </div>
                </div>
              );
            })}

            <div
              style={{
                background: "#eff6ff",
                borderRadius: 24,
                padding: 20,
                marginTop: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                }}
              >
                <span>Processing analysis</span>
                <span>{Math.round(progress)}%</span>
              </div>

              <div
                style={{
                  marginTop: 12,
                  height: 12,
                  background: "white",
                  borderRadius: 999,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    borderRadius: 999,
                    background:
                      "linear-gradient(90deg,#3b82f6,#22d3ee)",
                    transition: "all .5s",
                  }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div
            style={{
              padding: 35,
              background:
                "linear-gradient(180deg,#fff,#f8fafc)",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                color: "#2563eb",
                fontSize: 24,
                fontWeight: 900,
              }}
            >
              Analysis in progress...
            </h3>

            <p
              style={{
                color: "#64748b",
                lineHeight: 1.8,
              }}
            >
              We're checking ATS compatibility,
              matching your profile against the job
              requirements and generating
              recommendations.
            </p>

            <div
              style={{
                marginTop: 30,
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: 24,
                padding: 24,
              }}
            >
              <div
                style={{
                  color: "#64748b",
                  fontSize: 13,
                }}
              >
                Estimated processing time
              </div>

              <div
                style={{
                  fontSize: 32,
                  fontWeight: 950,
                  color: "#1d4ed8",
                }}
              >
                30–90 sec
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3,1fr)",
                gap: 12,
                marginTop: 24,
              }}
            >
              {["ATS", "AI", "PDF"].map((item) => (
                <div
                  key={item}
                  style={{
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: 18,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 900,
                      fontSize: 20,
                    }}
                  >
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 25,
            color: "#64748b",
            fontWeight: 600,
          }}
        >
          ✨ Tip: Cleaner job descriptions usually
          produce faster and more accurate results.
        </p>
      </main>
    </div>
  );
}