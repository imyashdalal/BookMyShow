import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

export const ThemeContext = createContext({
    theme: 'neon',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'neon'
    return localStorage.getItem('theme') || 'neon';
  });

  useEffect(() => {
    // Apply theme to HTML element
    document.documentElement.setAttribute('data-theme', theme);
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => prevTheme === 'neon' ? 'dark' : 'neon');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default function useTheme() {
    return useContext(ThemeContext);
}