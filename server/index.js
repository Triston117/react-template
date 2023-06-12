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

app.post("/api/tasks", (req, res) => {
  const { title, description, dueDate } = req.body; // Add dueDate destructuring

  pool.query(
    "INSERT INTO tasks (title, description, due_date) VALUES ($1, $2, $3) RETURNING *",
    [title, description, dueDate], // Include dueDate in the query parameters
    (error, result) => {
      if (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(result.rows[0]);
      }
    }
  );
});

app.get("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  pool.query("SELECT * FROM tasks WHERE id = $1", [taskId], (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).send("Internal Server Error");
    } else if (result.rows.length === 0) {
      res.status(404).send("Task not found");
    } else {
      res.send(result.rows[0]);
    }
  });
});

app.put("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const { description } = req.body;

  pool.query(
    "UPDATE tasks SET description = $1 WHERE id = $2 RETURNING *",
    [description, taskId],
    (error, result) => {
      if (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal Server Error");
      } else if (result.rows.length === 0) {
        res.status(404).send("Task not found");
      } else {
        res.send(result.rows[0]);
      }
    }
  );
});

// Update task priority
app.patch("/api/tasks/:id/priority", (req, res) => {
  const taskId = req.params.id;
  const { priority } = req.body;

  pool.query(
    "UPDATE tasks SET priority = $1 WHERE id = $2 RETURNING *",
    [priority, taskId],
    (error, result) => {
      if (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal Server Error");
      } else if (result.rows.length === 0) {
        res.status(404).send("Task not found");
      } else {
        res.send(result.rows[0]);
      }
    }
  );
});

// Update task completion status
app.patch("/api/tasks/:id/completion", (req, res) => {
  const taskId = req.params.id;
  const { completed } = req.body;

  pool.query(
    "UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *",
    [completed, taskId],
    (error, result) => {
      if (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal Server Error");
      } else if (result.rows.length === 0) {
        res.status(404).send("Task not found");
      } else {
        res.send(result.rows[0]);
      }
    }
  );
});
app.delete("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  pool.query(
    "DELETE FROM tasks WHERE id = $1 RETURNING *",
    [taskId],
    (error, result) => {
      if (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal Server Error");
      } else if (result.rows.length === 0) {
        res.status(404).send("Task not found");
      } else {
        res.send(result.rows[0]);
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
