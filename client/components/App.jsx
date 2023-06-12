import React, { useEffect, useState } from "react";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error("ERROR", error);
      });
  }, []);

  const handleTaskCreate = () => {
    fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: newTask,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks([...tasks, data]);
        setNewTask("");
      })
      .catch((error) => {
        console.error("ERROR", error);
      });
  };

  const handleTaskDelete = (taskId) => {
    fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedTasks = tasks.filter((task) => task.id !== data.id);
        setTasks(updatedTasks);
      })
      .catch((error) => {
        console.error("ERROR", error);
      });
  };

  return (
    <main>
      <div className="task-form">
        <input
          type="text"
          placeholder="New Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleTaskCreate}>Create Task</button>
      </div>

      {tasks.map((task) => (
        <div className="task" key={task.id}>
          <span>{task.description}</span>
          <button onClick={() => handleTaskDelete(task.id)}>Delete</button>
        </div>
      ))}
    </main>
  );
};

export default App;
