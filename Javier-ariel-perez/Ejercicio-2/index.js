import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

const alumnos = [];
let nextId = 1;


app.get("/alumnos", (req, res) => {
  const Estado = alumnos.map((a) => {
    const promedio = (a.nota1 + a.nota2 + a.nota3) / 3;
    let estado = "Reprobado";
    if (promedio >= 8) estado = "Promocionado";
    else if (promedio >= 6) estado = "Aprobado";

    return { ...a, promedio, estado };
  });

  res.json({ success: true, data: Estado });
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

  if (!nombre || isNaN(nota1) || isNaN(nota2) || isNaN(nota3)) {
    return res.status(400).json({ success: false, message: "Datos no válidos" });
  }


  const existe = alumnos.find(
    (a) => a.nombre.toLowerCase() === nombre.toLowerCase()
  );
  if (existe) {
    return res
      .status(400)
      .json({ success: false, message: "Ya es alumno" });
  }

  const Alumnonuevo = {
    id: nextId++,
    nombre: nombre.trim(),
    nota1: Number(nota1),
    nota2: Number(nota2),
    nota3: Number(nota3),
  };

  alumnos.push(Alumnonuevo);

  res.status(201).json({ success: true, data: Alumnonuevo });
});


app.put("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "ID inválido" });
  }

  const { nombre, nota1, nota2, nota3 } = req.body;

  if (!nombre || isNaN(nota1) || isNaN(nota2) || isNaN(nota3)) {
    return res.status(400).json({ success: false, message: "Datos inválidos" });
  }

  
  let alumnoEncontrado = alumnos.find((a) => a.id === id);
  if (!alumnoEncontrado) {
    return res
      .status(404)
      .json({ success: false, message: "Alumno no encontrado" });
  }


  const repetido = alumnos.find(
    (a) => a.nombre.toLowerCase() === nombre.toLowerCase() && a.id !== id
  );
  if (repetido) {
    return res
      .status(400)
      .json({ success: false, message: "Ya es alumno" });
  }

  alumnoEncontrado.nombre = nombre.trim();
  alumnoEncontrado.nota1 = Number(nota1);
  alumnoEncontrado.nota2 = Number(nota2);
  alumnoEncontrado.nota3 = Number(nota3);

  res.json({ success: true, data: alumnoEncontrado });
});

app.listen(port, () => {
  console.log(`La aplicación está funcionando en puerto ${port}`);
});
