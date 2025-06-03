import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hook/useTheme';
import { CSSProperties } from 'styled-components';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const styles = getStyles();

  return (
    <div
      style={styles.toggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Background tracks */}

      {/* Sliding thumb */}
      {/* <motion.div
        style={styles.thumb}
        animate={{
          x: isDark ? '100%' : '0%',
        }}
        // transition={{
        //   type: 'spring',
        //   stiffness: 300,
        //   damping: 25,
        // }}
      > */}
        {/* Active icon in thumb */}
        <motion.div
          key={isDark ? 'moon' : 'sun'}
          // animate={{ scale: 1, rotate: 0 }}
          // transition={{ duration: 0.2 }}
        >
          {isDark ? (
            <Moon size={17} style={styles.moon} />
          ) : (
            <Sun size={17} style={styles.sun} />
          )}
        </motion.div>
    </div>
  );
};

export default ThemeToggle;

const getStyles = () => ({
  toggle: {
    borderRadius: '25px',
    cursor: 'pointer',
    border: '2px solid #ccc',
    padding: '7px 7px 0 7px',
    // transition: 'background-color ease',
  } as CSSProperties,
  thumb: {
    // transition: 'transform 0.3s ease',
  },
  // Add more styles as needed
  sun: {
    color: '#16a085',
    padding: '4px',
    backgroundColor: 'white',
    borderRadius: '50%',
  } as CSSProperties,
  moon: {
    color: '#fff',
    padding: '4px',
    backgroundColor: 'gray',
    borderRadius: '50%',
  } as CSSProperties,
})