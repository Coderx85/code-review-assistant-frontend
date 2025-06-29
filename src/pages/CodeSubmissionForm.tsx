import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { apiClient } from "../api/ApiClient";
import { CodeSubmission } from "../types";
import { useTheme } from "../hook/useTheme";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { autocompletion } from "@codemirror/autocomplete";

const CodeSubmissionForm = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("java");
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<string | null>(null);
  const reviewRef = useRef<HTMLDivElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { isDark } = useTheme();
  const styles = getStyles(isDark);

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "auto";
    document.documentElement.style.overflowX = "hidden";
    document.documentElement.style.overflowY = "auto";
  }, []);

  useEffect(() => {
    if (review) {
      setTimeout(() => {
        reviewRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 1000);
    }
  }, [review]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to get the correct language mode
  const getLanguageExtension = () => {
    switch (language) {
      case "javascript":
        return javascript();
      case "java":
        return java();
      case "python":
        return python();
      case "cpp":
        return cpp();
      default:
        return java();
    }
  };

  const handleSubmit = async () => {
    if (!code) {
      toast.error("Please enter some code before submitting.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token) {
        toast.error("You must be logged in to submit code.");
        return;
      }
      if (!userId) {
        toast.error("User ID is missing. Please log in again.");
        return;
      }

      const payload: CodeSubmission = { code, language, userId };
      const response = await apiClient.post("/api/code-review/submit", payload);

      if (response.status === 200) {
        setReview(response.data.aiFeedback ?? "No feedback available.");
        toast.success("Code reviewed successfully!");
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error submitting code:", error);
      toast.error("Failed to get review. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        ...styles.container,
      }}
    >
      {" "}
      <div style={styles.card} className="code-submission-card">
        <h2 style={styles.title} className="title">
          Submit Your Code
        </h2>
        <CodeMirror
          value={code}
          height="300px"
          extensions={[getLanguageExtension(), autocompletion()]}
          theme={isDark ? "dark" : "light"}
          onChange={(value) => setCode(value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            ...styles.codeMirror,
            border: isFocused
              ? `2px solid ${isDark ? "#1abc9c" : "#2980b9"}`
              : `1px solid ${isDark ? "#555" : "#ddd"}`,
            boxShadow: isFocused
              ? `0 0 10px ${
                  isDark ? "rgba(26, 188, 156, 0.3)" : "rgba(41, 128, 185, 0.3)"
                }`
              : "none",
          }}
          basicSetup={{
            lineNumbers: true,
          }}
        />{" "}
        <div>
          <label style={styles.label}>Select Language</label>
          <div style={{ position: "relative" }} ref={dropdownRef}>
            {" "}
            <select
              ref={selectRef}
              style={{
                width: "100%",
                padding: "12px 40px 12px 12px",
                backgroundColor: isDark ? "#34495e" : "#f8f9fa",
                color: isDark ? "white" : "#2c3e50",
                border: isDark ? "1px solid #555" : "1px solid #ddd",
                borderRadius: "8px",
                marginTop: "9px",
                cursor: "pointer",
                appearance: "none",
                position: "relative",
                fontSize: "14px",
                transition: "all 0.3s ease",
                boxShadow: isDark
                  ? "0 2px 8px rgba(0, 0, 0, 0.2)"
                  : "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setIsDropdownOpen(false);
                setTimeout(() => selectRef.current?.blur(), 100);
              }}
              onMouseDown={() => setIsDropdownOpen(true)}
              onBlur={() => setIsDropdownOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = isDark
                  ? "#1abc9c"
                  : "#2980b9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isDark ? "#555" : "#ddd";
              }}
            >
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
            </select>{" "}
            <span
              style={{
                position: "absolute",
                top: "60%",
                right: "15px",
                transform: isDropdownOpen
                  ? "translateY(-50%) rotate(180deg)"
                  : "translateY(-50%) rotate(0deg)",
                transition: "transform 0.15s ease-in-out",
                pointerEvents: "none",
                fontSize: "13px",
                color: isDark ? "#ccc" : "#666",
              }}
            >
              ▲
            </span>
          </div>
        </div>{" "}
        <div style={{ display: "flex", justifyContent: "center" }}>
          {" "}
          <button
            style={styles.button}
            className="submit-button"
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = isDark
                ? "#16a085"
                : "#2980b9";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#1abc9c";
              e.currentTarget.style.transform = "scale(1)";
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Reviewing...
              </>
            ) : (
              "Submit Code"
            )}
          </button>
        </div>{" "}
        <style>
          {`
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid white;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 768px) {
      .code-submission-card {
        width: 95% !important;
        margin: 20px auto !important;
        padding: 20px !important;
        margin-top: 60px !important;
      }
      .submit-button {
        width: 80% !important;
        min-width: unset !important;
      }
      .title {
        font-size: 22px !important;
      }
    }

    @media (max-width: 480px) {
      .code-submission-card {
        margin-top: 40px !important;
        padding: 15px !important;
      }
      .submit-button {
        width: 100% !important;
      }
      .title {
        font-size: 20px !important;
      }
    }
  `}
        </style>{" "}
        {review && (
          <div ref={reviewRef} style={styles.reviewContainer}>
            <h3 style={styles.reviewTitle}>AI Review Feedback</h3>
            <div style={styles.reviewContent}>
              {review
                .split(/\d+\.\s/)
                .filter(Boolean)
                .map((point, index) => (
                  <p
                    key={index}
                    style={{
                      marginBottom: "8px",
                      color: isDark ? "#e8e8e8" : "#333",
                    }}
                  >
                    {`${index + 1}. ${point.trim()}`}
                  </p>
                ))}
            </div>
          </div>
        )}
      </div>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

const getStyles = (isDark: boolean) => ({
  container: {
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    width: "100vw",
    background: isDark
      ? "linear-gradient(to bottom right, #2c3e50, #34495e)"
      : "linear-gradient(to bottom right, #ecf0f1, #bdc3c7)",
    color: isDark ? "white" : "black",
  },
  card: {
    width: "100%",
    maxWidth: "800px",
    minHeight: "600px",
    marginTop: "80px",
    paddingBottom: "35px",
    backgroundColor: isDark ? "#2c3e50" : "white",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: isDark
      ? "0px 10px 30px rgba(0, 0, 0, 0.5)"
      : "0px 10px 30px rgba(0, 0, 0, 0.1)",
    marginBottom: "40px",
    animation: "fadeInUp 0.6s ease-out",
    fontFamily: "'Playfair Display', serif",
    border: isDark ? "1px solid #34495e" : "1px solid #e9ecef",
  },
  title: {
    textAlign: "center" as const,
    fontSize: "28px",
    marginBottom: "25px",
    marginTop: "5px",
    color: isDark ? "#1abc9c" : "#2980b9",
    fontWeight: "bold",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold",
    color: isDark ? "#1abc9c" : "#2980b9",
    marginBottom: "8px",
  },
  button: {
    width: "50%",
    minWidth: "200px",
    padding: "12px 20px",
    backgroundColor: "#1abc9c",
    color: "white",
    border: "none",
    borderRadius: "25px",
    marginTop: "20px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxShadow: isDark
      ? "0 4px 15px rgba(26, 188, 156, 0.4)"
      : "0 4px 15px rgba(41, 128, 185, 0.4)",
  },
  reviewContainer: {
    marginTop: "40px",
    padding: "25px",
    backgroundColor: isDark ? "#34495e" : "#f8f9fa",
    borderRadius: "10px",
    textAlign: "center" as const,
    marginBottom: "40px",
    border: isDark ? "1px solid #555" : "1px solid #e9ecef",
    boxShadow: isDark
      ? "0 4px 15px rgba(0, 0, 0, 0.3)"
      : "0 4px 15px rgba(0, 0, 0, 0.1)",
  },
  reviewTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: isDark ? "#1abc9c" : "#2980b9",
    marginBottom: "15px",
  },
  reviewContent: {
    textAlign: "left" as const,
    marginTop: "15px",
    whiteSpace: "pre-line" as const,
    lineHeight: "1.6",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "800px",
    padding: "20px",
    backgroundColor: isDark ? "#2c3e50" : "#ecf0f1",
    borderRadius: "10px",
    boxShadow: isDark
      ? "0px 0px 10px rgba(0, 0, 0, 0.3)"
      : "0px 0px 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "40px",
    animation: "fadeInUp 0.6s ease-out",
    fontFamily: "'Playfair Display', serif",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
    color: isDark ? "#1abc9c" : "#2980b9",
    textAlign: "center" as const,
  },
  codeMirror: {
    borderRadius: "8px",
    backgroundColor: isDark ? "#1e272e" : "#f5f6fa",
    color: isDark ? "#dfe4ea" : "#2f3542",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "14px",
    width: "100%",
    marginBottom: "20px",
    border: isDark ? "1px solid #555" : "1px solid #ddd",
  },
});

export default CodeSubmissionForm;
