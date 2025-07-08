// src/router/AppRouter.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SubscritorPage from '../services/App'; // asegúrate que este componente retorne JSX
import LoginForm from '../components/LoginForm/LoginForm';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/prueba" element={<SubscritorPage />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
