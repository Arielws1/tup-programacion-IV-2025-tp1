import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

const alumnos = [];
let nextId = 1;


app.get("/alumnos", (req, res) => {
  const resultados = alumnos.map((a) => {
    const promedio = (a.nota1 + a.nota2 + a.nota3) / 3;
    let estado = "Reprobado";
    if (promedio >= 8) estado = "Promocionado";
    else if (promedio >= 6) estado = "Aprobado";

    return { ...a, promedio, estado };
  });

  res.json(resultados);
});


app.get("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);
  const alumno = alumnos.find((a) => a.id === id);

  if (!alumno) {
    return res.status(404).json({ error: "Alumno no encontrado" });
  }

  const promedio = (alumno.nota1 + alumno.nota2 + alumno.nota3) / 3;
  let estado = "Reprobado";
  if (promedio >= 8) estado = "Promocionado";
  else if (promedio >= 6) estado = "Aprobado";

  res.json({ ...alumno, promedio, estado });
});

app.get("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "ID no válido" });
  }

  const alumno = alumnos.find((a) => a.id === id);
  if (!alumno) {
    return res
      .status(404)
      .json({ success: false, message: "Alumno no encontrado" });
  }

  const promedio = (alumno.nota1 + alumno.nota2 + alumno.nota3) / 3;
  let estado = "Reprobado";
  if (promedio >= 8) estado = "Promocionado";
  else if (promedio >= 6) estado = "Aprobado";

  res.json({ success: true, data: { ...alumno, promedio, estado } });
});


app.post("/alumnos", (req, res) => {
  const { nombre, nota1, nota2, nota3 } = req.body;

  if (!nombre || !nota1 || !nota2 || !nota3) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  if (alumnos.find((a) => a.nombre.toLowerCase() === nombre.toLowerCase())) {
    return res.status(400).json({ error: "El alumno ya existe" });
  }

  const nuevo = {
    id: nextId++,
    nombre,
    nota1: Number(nota1),
    nota2: Number(nota2),
    nota3: Number(nota3),
  };

  alumnos.push(nuevo);
  res.status(201).json(nuevo);
});


app.put("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);
  const { nombre, nota1, nota2, nota3 } = req.body;

  const alumno = alumnos.find((a) => a.id === id);
  if (!alumno) {
    return res.status(404).json({ error: "Alumno no encontrado" });
  }

  if (!nombre || !nota1 || !nota2 || !nota3) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  if (alumnos.find((a) => a.nombre.toLowerCase() === nombre.toLowerCase() && a.id !== id)) {
    return res.status(400).json({ error: "El nombre ya está usado" });
  }

  alumno.nombre = nombre;
  alumno.nota1 = Number(nota1);
  alumno.nota2 = Number(nota2);
  alumno.nota3 = Number(nota3);

  res.json(alumno);
});

app.listen(port, () => {
  console.log(`La aplicación está funcionando en puerto ${port}`);
});
