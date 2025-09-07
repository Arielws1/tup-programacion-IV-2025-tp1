import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

const poligonos = [];

app.post("/poligonos", (req, res) => {
  const { largo, ancho } = req.body;

  if (!largo || !ancho || largo <= 0 || ancho <= 0) {
    return res.status(400).json({ error: "Largo y ancho deben ser positivos" });
  }

  const perimetro = 2 * (largo + ancho);
  const superficie = largo * ancho;

  const nuevo = { largo, ancho, perimetro, superficie };
  poligonos.push(nuevo);

  res.status(201).json({ mensaje: "Polígono agregado", poligono: nuevo });
});

app.get("/poligonos", (req, res) => {
  const resultados = poligonos.map((p) => {
    const tipo = p.largo === p.ancho ? "Cuadrado" : "Rectángulo";
    return { ...p, tipo };
  });

  res.json(resultados);
});


app.get("/poligonos/:id", (req, res) => {
  const id = req.params.id; 

  if (id < 0 || id >= poligonos.length) {
    return res.status(404).json({ error: "Polígono no encontrado" });
  }

  const p = poligonos[id];
  const tipo = p.largo === p.ancho ? "Cuadrado" : "Rectángulo";

  res.json({ ...p, tipo });
});

app.listen(port, () => {
  console.log(`La aplicación está funcionando en puerto ${port}`);
});
