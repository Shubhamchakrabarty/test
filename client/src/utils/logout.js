// src/utils/logout.js

import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const logout = () => {
        // Remove user from localStorage
        localStorage.removeItem('user');

        // Reset user context to null
        setUser(null);

        // Redirect to the homepage
        navigate('/');
    };

    return logout;
};
