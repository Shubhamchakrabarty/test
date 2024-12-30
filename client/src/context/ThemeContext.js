// context/ThemeContext.js
import React, { createContext, useState } from 'react';
import 'survey-core/defaultV2.min.css'; // Import the SurveyJS theme
import { surveyThemeDarkPanelless } from '../surveyForms/survey_theme_dark_panelless'; // Import the dark theme

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(surveyThemeDarkPanelless); // Default theme

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};