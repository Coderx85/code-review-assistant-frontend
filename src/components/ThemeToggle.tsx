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
    <motion.div
      style={styles.toggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Active icon in thumb */}
      <motion.div
        key={isDark ? 'moon' : 'sun'}
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ 
          duration: 0.5,
          ease: 'backOut',
          scale: { type: 'tween', stiffness: 400, damping: 15 }
        }}
      >
        {isDark ? (
          <motion.div
            transition={{ 
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <Moon size={17} style={styles.moon} />
          </motion.div>
        ) : (
          <motion.div
            transition={{ 
              duration: 1.5,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 2
            }}
          >
            <Sun size={17} style={styles.sun} />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ThemeToggle;

const getStyles = () => ({
  toggle: {
    borderRadius: '25px',
    cursor: 'pointer',
    padding: '7px 7px 0 7px',
    // backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  } as CSSProperties,
  sun: {
    color: '#16a085',
    padding: '7px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
  } as CSSProperties,
  moon: {
    color: '#e5e7eb',
    padding: '7px',
    backgroundColor: '#374151',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
  } as CSSProperties,
})