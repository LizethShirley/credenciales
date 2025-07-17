// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PreviewPage from '../pages/preview';
import Layout from '../Layout/Layout';
import CredencialPage from '../pages/CredencialPage';

import ListaCredenciales from '../pages/Usuarios/ListaCredenciales'
import CredencialIndividual from '../pages/Usuarios/CredencialIndividual'

import GestionarUnidad from '../pages/Organizacion/GestionarUnidad'
import GestionarCargo from '../pages/Organizacion/GestionarCargo'
import GestionarExterno from '../pages/Organizacion/GestionarExterno'

const App = () => {
  return (
    <BrowserRouter>
  <Routes>
    {/* Redirección por defecto a /Credenciales */}

    {/* Esto es como tu "página aparte", sin Layout */}
    <Route path="/" element={<CredencialPage />} />
    <Route path="/preview" element={<PreviewPage />} />

    <Route path="/CredencialesTED" element={<Layout />}>
      <Route index element={<Navigate to="/CredencialesTED/Inicio" />} />
      <Route path="Inicio" element={<CredencialPage />} />

      <Route path="Usuarios/Lista_Credenciales" element={<ListaCredenciales />} />
      <Route path="Usuarios/Credencial_Individual" element={<CredencialIndividual />} />

      <Route path="Organización/Gestionar_Unidad" element={<GestionarUnidad />} />
      <Route path="Organización/Gestionar_Cargo" element={<GestionarCargo />} />
      <Route path="Organización/Gestionar_Externo" element={<GestionarExterno />} />
    </Route>
  </Routes>
</BrowserRouter>

  );
};

export default App;
