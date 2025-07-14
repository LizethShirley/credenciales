const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");

app.use(cors());
app.use(express.json());

const PORT = 8000;

// Cargar usuarios desde bd.json
const loadUsers = () => {
  const raw = fs.readFileSync("bd.json");
  const data = JSON.parse(raw);
  return data.users;
};

// Ruta POST que recibe fechaInicio y fechaFin
app.post("/filtrar-usuarios", (req, res) => {
  const { fechaInicio, fechaFin } = req.body;
  const start = new Date(fechaInicio);
  const end = new Date(fechaFin);

  const usuarios = loadUsers();

  const filtrados = usuarios.filter((user) => {
    const fecha = new Date(user.fechaInicio);
    return fecha >= start && fecha <= end;
  });

  res.json(filtrados);
  console.log("Filtrados "+ filtrados);
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
