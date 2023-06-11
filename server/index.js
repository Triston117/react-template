import express from "express";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const PORT = process.env.PORT;
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();

app.use(express.json());

app.get("/api/tasks", (req, res) => {
  pool.query("SELECT * FROM tasks", (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).send("Internal Server Error");
    } else {
      res.send(result.rows);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
