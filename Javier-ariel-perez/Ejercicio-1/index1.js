import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

const poligonos = []; 
let nextId = 1;


app.get("/poligonos", (req, res) => {
  const Tipo = poligonos.map((f) => ({
    ...f,
    tipo: f.largo === f.ancho ? "Cuadrado" : "Rectángulo"
  }));
  res.json({ success: true, data: Tipo });
});


app.post("/poligonos", (req, res) => {
  const { largo, ancho } = req.body;

  if (largo === undefined || ancho === undefined || largo <= 0 || ancho <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Largo o ancho no válido" });
  }

  const nuevoPoligono = {
    id: nextId++,
    largo,
    ancho,
    perimetro: 2 * (largo + ancho),
    superficie: largo * ancho
  };

  poligonos.push(nuevoPoligono); 

  res.status(201).json({ success: true, data: nuevoPoligono });
});

app.listen(port, () => {
  console.log(`La aplicación está funcionando en puerto ${port}`);
});
