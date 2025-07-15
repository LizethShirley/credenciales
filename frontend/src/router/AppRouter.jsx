// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Inicio from '../pages/Inicio';
import Usuarios from '../pages/Usuario';
import Organizaciones from '../pages/Organizaciones';
import Prueba from '../services/App';
import CredencialesPage from '../pages/CredencialPage';

import ListaCredenciales from '../pages/Usuarios/ListaCredenciales'
import CredencialMasivo from '../pages/Usuarios/CredencialMasivo'
import CredencialIndividual from '../pages/Usuarios/CredencialIndividual'

import GestionarUnidad from '../pages/Organizacion/GestionarUnidad'
import GestionarCargo from '../pages/Organizacion/GestionarCargo'
import GestionarExterno from '../pages/Organizacion/GestionarExterno'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
    {/* Esto es como tu "página aparte", sin Layout */}
    <Route path="/Credenciales" element={<CredencialIndividual/>} />

    {/* Esto son las rutas internas que SI tienen Layout */}
    <Route path="/CredencialesTED" element={<Layout />}>
          <Route index element={<Navigate to="/CredencialesTED/Inicio" />} />
          <Route path="Inicio" element={<CredencialesPage/>} />
          <Route path="Prueba" element={<Prueba/>} />

          <Route path="Usuarios/Lista_Credenciales" element={<ListaCredenciales/>}/> 
          <Route path="Usuarios/Credencial_Masivo" element={<CredencialMasivo/>}/> 
          <Route path="Usuarios/Credencial_Individual" element={<CredencialIndividual/>}/> 

          <Route path="Organización/Gestionar_Unidad" element={<GestionarUnidad/>}/> 
          <Route path="Organización/Gestionar_Cargo" element={<GestionarCargo/>}/> 
          <Route path="Organización/Gestionar_Externo" element={<GestionarExterno/>}/> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
