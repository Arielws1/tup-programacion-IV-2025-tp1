import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

const tareas = [];
let nextId = 1; // ID incremental

// GET - Listar tareas con filtro por completadas o pendientes
app.get("/tareas", (req, res) => {
  const { completada } = req.query;

  let listaFiltrada = tareas;

  if (completada !== undefined) {
    // Convertimos directamente a boolean dentro del filter
    listaFiltrada = tareas.filter(t => t.completada === (completada === "true"));
  }

  res.json({ success: true, data: listaFiltrada });
});

// POST - Crear nueva tarea
app.post("/tareas", (req, res) => {
  const { nombre, completada } = req.body;

  if (!nombre) {
    return res.status(400).json({ success: false, message: "Nombre de tarea requerido" });
  }

  // Verificar que no exista otra tarea con el mismo nombre
  const existe = tareas.find(t => t.nombre.toLowerCase() === nombre.toLowerCase());
  if (existe) {
    return res.status(400).json({ success: false, message: "Tarea ya existe" });
  }

  const tareaNueva = {
    id: nextId++,
    nombre: nombre.trim(),
    completada: completada === true
  };

  tareas.push(tareaNueva);

  res.status(201).json({ success: true, data: tareaNueva });
});

// 4 tareas iniciales, cortas y básicas
const ejemplos = ["Código", "API", "Tests", "Docs"];
ejemplos.forEach(nombre => {
  tareas.push({ id: nextId++, nombre, completada: false });
});

app.listen(port, () => {
  console.log(`API de tareas funcionando en puerto ${port}`);
});