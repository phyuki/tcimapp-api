require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Sequelize = require("sequelize");
const model = require("./src/models");
const port = process.env.PORT || 3000;

const authRoutes = require("./src/routes/auth.routes");
const professionalRoutes = require("./src/routes/professional.routes");
const patientRoutes = require("./src/routes/patient.routes");
const reportRoutes = require("./src/routes/report.routes");
const dassRoutes = require("./src/routes/dass.routes");

let app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/professionals", professionalRoutes);
app.use("/patients", patientRoutes);
app.use("/reports", reportRoutes);
app.use("/dass", dassRoutes);

app.get("/teste", async (req, res) => {
  res.send(JSON.stringify("OK!"));
});

app.get("/disorders", async (req, res) => {
  const exists = await model.scidQuestions.findAll({
    where: { disorder: req.query.disorder },
  });

  if (exists) {
    const allItems = exists.map((item) => [
      item.dataValues.id,
      item.dataValues.cod,
      item.dataValues.question,
    ]);
    res.json(allItems);
  }
});

app.post("/details", async (req, res) => {
  const allCriteria = req.body.criteria.map((value) =>
    value === undefined ? null : value,
  );
  const allScores = req.body.score.map((value) =>
    value === undefined ? null : value,
  );

  const reportDetails = allCriteria.map((criteria, ind) => ({
    criteria,
    score: allScores[ind],
    disorder: req.body.disorder,
    patientId: req.body.patientId,
  }));

  const report = await model.scidcriteria.bulkCreate(reportDetails);

  if (report) {
    res.send(JSON.stringify(report));
  }
});

app.listen(port, () => {
  console.log("Servidor está rodando...");
});
