import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import NavBar from "../components/NavBar";
import { useTheme } from "../hook/useTheme";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const name = localStorage.getItem("name") || "User";
  const { isDark } = useTheme();

  const styles = getStyles(isDark);

  const handleGetStarted = () => {
    navigate("/review");
  };

  return (
    <div style={styles.container}>
      {/* Navigation Menu */}
      <NavBar />

      <div style={styles.headerContainer}>
        <h1 style={styles.heading}>
          <TypewriterText text={`Welcome, ${name}!`} />
        </h1>
        <p style={styles.subheading}>
          Enhance your coding skills with intelligent feedback powered by AI. Just submit your code and get detailed insights.
        </p>
      </div>

      {/* Get Started Button */}
      <button
        style={isHovered ? { ...styles.button, ...styles.buttonHovered } : styles.button}
        onClick={handleGetStarted}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered ? "Get Started >>" : "Get Started"}
      </button>

      {/* Copyright */}
      <div style={styles.footer}>
        <p style={styles.copyright}>© 2025 Soumyadeep Das</p>
      </div>
    </div>
  );
};

const getStyles = (isDark: boolean) => ({
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
    background: isDark 
      ? "linear-gradient(to bottom right, #2c3e50, #34495e)"
      : "linear-gradient(to bottom right, #f8fafc, #e2e8f0)",
    fontFamily: "'Playfair Display', serif",
    textAlign: "center" as const,
    margin: 0,
    position: "relative" as const,
    paddingTop: "70px",
    boxSizing: "border-box" as const,
    transition: "all 0.3s ease",
  },
  headerContainer: {
    marginBottom: "40px",
  },
  heading: {
    fontSize: "36px",
    color: isDark ? "#000" : "#1f2937",
    marginBottom: "10px",
    paddingBottom: "10px",
    fontWeight: "700",
    overflow: "hidden",
    whiteSpace: "nowrap" as const,
  },
  subheading: {
    fontSize: "18px",
    color: isDark ? "#fff" : "#374151",
    lineHeight: "1.5",
    maxWidth: "500px",
    margin: "0 auto",
  },
  button: {
    backgroundColor: "#1abc9c",
    color: "#fff",
    fontSize: "18px",
    padding: "15px 30px",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    transition: "background-color 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease",
    boxShadow: "0 0 10px rgba(26, 188, 156, 0.8)",
    marginBottom: "15px",
  },
  buttonHovered: {
    backgroundColor: "#16a085",
    transform: "scale(1.1)",
    boxShadow: "0 0 15px rgba(22, 160, 133, 1)",
  },
  footer: {
    position: "absolute" as const,
    bottom: "10px",
    width: "100%",
    textAlign: "center" as const,
    backgroundColor: isDark 
      ? "rgba(255, 255, 255, 0.05)" 
      : "rgba(0, 0, 0, 0.05)",
    padding: "10px 0",
    borderTop: isDark 
      ? "1px solid rgba(255, 255, 255, 0.1)"
      : "1px solid rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(4px)",
    boxShadow: isDark 
      ? "0 -2px 10px rgba(0, 0, 0, 0.2)"
      : "0 -2px 10px rgba(0, 0, 0, 0.1)",
  },
  copyright: {
    fontSize: "14px",
    color: isDark ? "#fff" : "#6b7280",
    margin: "0",
  },
});

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const { isDark } = useTheme();

  React.useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text.charAt(index));
        setIndex(prev => prev + 1);
      }, 40);

      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  // Enhanced theme-based styling
  const getThemeStyles = () => ({
    color: isDark ? '#ffffff' : '#1f2937',
    transition: 'all 0.3s ease-in-out',
    textShadow: isDark 
      ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)' 
      : '0 2px 4px rgba(31, 41, 55, 0.2)',
    filter: isDark ? 'brightness(1.1)' : 'brightness(0.95)',
  });

  const getCursorStyles = () => ({
    backgroundColor: isDark ? '#ffffff' : '#1f2937',
    transition: 'all 0.3s ease-in-out',
    boxShadow: isDark 
      ? '0 0 8px rgba(255, 255, 255, 0.6), 0 0 16px rgba(255, 255, 255, 0.3)' 
      : '0 0 4px rgba(31, 41, 55, 0.4), 0 2px 8px rgba(31, 41, 55, 0.2)',
  });

  return (
    <span 
      className={`typewriter-js ${isDark ? 'dark-theme' : 'light-theme'}`}
      style={getThemeStyles()}
    >
      {displayedText}
      <span 
        className="cursor"
        style={getCursorStyles()}
      >
        <pre>  </pre>
      </span>
    </span>
  );
};

export default Home;