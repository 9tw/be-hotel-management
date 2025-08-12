const express = require("express");
const routes = require("./routes/index");

const app = express();
const port = 3005;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", routes);

app.listen(port, () => {
  console.log(`Server up and run on port ${port}`);
});
