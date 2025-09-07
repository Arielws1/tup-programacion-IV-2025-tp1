import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

const tareas = [];


const ejemplos = ["Código", "API", "Tests", "Docs"];
ejemplos.forEach(nombre => {
  tareas.push({ nombre, completada: false });
});


app.post("/tareas", (req, res) => {
  const { nombre, completada } = req.body;


  if (!nombre) {
    return res.status(400).json({ error: "Nombre de tarea requerido" });
  }


  if (tareas.find(t => t.nombre.toLowerCase() === nombre.toLowerCase())) {
    return res.status(400).json({ error: "Tarea ya existe" });
  }

  const nueva = {
    nombre,
    completada: completada === true 
  };

  tareas.push(nueva);
  res.status(201).json({ mensaje: "Tarea agregada", tarea: nueva });
});


app.get("/tareas", (req, res) => {
  const completadaQuery = req.query.completada;

  let lista = tareas;


  if (completadaQuery === "true") lista = tareas.filter(t => t.completada === true);
  else if (completadaQuery === "false") lista = tareas.filter(t => t.completada === false);

  res.json(lista);
});


app.get("/tareas/:id", (req, res) => {
  const id = req.params.id;

  if (id < 0 || id >= tareas.length) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  res.json(tareas[id]);
});

app.listen(port, () => {
  console.log(`API de tareas funcionando en puerto ${port}`);
});