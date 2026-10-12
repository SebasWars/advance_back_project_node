import "dotenv/config";
import express from "express";
import { notes } from "./routes/notes.routes.js";
import { logging } from "./middleware/logging.js";

const Port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(logging)
app.use("/notes", notes);

app.listen(Port, () => {
  console.log(`server is running in port: http://localhost:${Port}`);
});
