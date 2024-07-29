import express, { json, urlencoded } from "express";
import cors from "cors";
import 'dotenv/config';
import morgan from "morgan";

const app = express();

const logger = morgan('combined');
app.use(logger);

app.use(cors());

app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export const start = () => {
  app.listen(process.env.PORT, () => {
    console.log(`Server started on port: ${process.env.PORT}`);
  });
}

export default app;
