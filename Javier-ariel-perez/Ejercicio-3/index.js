import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

const tareas = [];
let nextId = 1; 


app.get("/tareas", (req, res) => {
  const { completada } = req.query;

  let listaFiltrada = tareas;

  if (completada !== undefined) {
  
    listaFiltrada = tareas.filter(t => t.completada === (completada === "true"));
  }

  res.json({ success: true, data: listaFiltrada });
});


app.post("/tareas", (req, res) => {
  const { nombre, completada } = req.body;

  if (!nombre) {
    return res.status(400).json({ success: false, message: "Nombre de tarea requerido" });
  }

  
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


const ejemplos = ["Código", "API", "Tests", "Docs"];
ejemplos.forEach(nombre => {
  tareas.push({ id: nextId++, nombre, completada: false });
});

app.listen(port, () => {
  console.log(`API de tareas funcionando en puerto ${port}`);
});