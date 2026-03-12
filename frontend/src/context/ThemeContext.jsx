import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Initialize state based on localStorage or default to 'dark'
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme) return savedTheme;
            return "dark"; // Default to dark as per existing design
        }
        return "dark";
    });

    useEffect(() => {
        // Apply the class to the html element
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);

        // Save preference
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
