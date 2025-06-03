import { useTheme } from '../hook/useTheme';
import './NotFound.css';

const NotFound = () => {
  const { isDark } = useTheme();
  const styles = getStyles(isDark);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>404</h1>
        <p style={styles.subtitle}>Oops! The page you're looking for doesn't exist.</p>
        <a href="/" style={styles.button}>Go Home</a>
      </div>
    </div>
  );
};

const getStyles = (isDark: boolean) => ({
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: isDark 
      ? "linear-gradient(135deg, #2c3e50, #34495e)"
      : "linear-gradient(135deg, #f6f8fa, #e0e7ff)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    transition: "all 0.3s ease",
  },
  content: {
    textAlign: "center" as const,
    padding: "40px",
    borderRadius: "20px",
    backgroundColor: isDark ? "#333" : "white",
    boxShadow: isDark 
      ? "0 20px 40px rgba(0, 0, 0, 0.3)"
      : "0 20px 40px rgba(0, 0, 0, 0.1)",
    animation: "fadeIn 1s ease-in-out",
    border: isDark ? "1px solid #555" : "none",
  },
  title: {
    fontSize: "120px",
    fontWeight: "bold",
    margin: "0",
    color: isDark ? "#ff6b9d" : "#ff6b6b",
    animation: "float 2.5s ease-in-out infinite",
    textShadow: isDark ? "0 0 20px rgba(255, 107, 157, 0.3)" : "none",
  },
  subtitle: {
    fontSize: "20px",
    margin: "20px 0",
    color: isDark ? "#e8e8e8" : "#555",
  },
  button: {
    display: "inline-block",
    padding: "12px 24px",
    marginTop: "10px",
    backgroundColor: isDark ? "#1abc9c" : "#6366f1",
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    boxShadow: isDark 
      ? "0 0 15px rgba(26, 188, 156, 0.4)"
      : "0 0 15px rgba(99, 102, 241, 0.4)",
  } as React.CSSProperties,
});

export default NotFound;