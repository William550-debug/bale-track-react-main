// src/context/useTheme.js
import { useContext } from 'react';
import ThemeContext from './src/context/ThemeProvider';

export const useTheme = () => useContext(ThemeContext);
export default useTheme;