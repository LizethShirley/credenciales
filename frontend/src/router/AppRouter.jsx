// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PreviewPage from '../pages/preview';
import Layout from '../Layout/Layout';
import Login from '../pages/Login/Login';
import CredencialPage from '../pages/CredencialPage';

import ListaCredenciales from '../pages/Usuarios/ListaCredenciales';
import CredencialIndividual from '../pages/Usuarios/CredencialIndividual';

import GestionarUnidad from '../pages/Organizacion/GestionarUnidad';
import GestionarCargo from '../pages/Organizacion/GestionarCargo';
import GestionarExterno from '../pages/Organizacion/GestionarExterno';
import AccesoComputo from '../pages/AccesoComputo';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Esta es la única ruta fuera del Layout */}
        <Route path="/login" element={<Login/>} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/accesoComputo/:token" element={<AccesoComputo />} />

        {/* Todo lo demás dentro de Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/Inicio" />} />

          <Route path="/Inicio" element={<CredencialPage />} />

          <Route path="/Lista_Credenciales" element={<ListaCredenciales />} />
          <Route path="/Credencial_Individual" element={<CredencialIndividual />} />

          <Route path="/Gestionar_Unidad" element={<GestionarUnidad />} />
          <Route path="/Gestionar_Cargo" element={<GestionarCargo />} />
          <Route path="/Gestionar_Externo" element={<GestionarExterno />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
