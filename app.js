const express = require("express");
const cors = require("cors");
const routes = require("./routes/index");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3005;

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  fileUpload({
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
    abortOnLimit: true,
    createParentPath: true, // auto-create folder if needed
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", routes);

app.listen(port, () => {
  console.log(`Server up and run on port ${port}`);
});
