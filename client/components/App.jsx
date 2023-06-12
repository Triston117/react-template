import React, { useEffect, useState } from "react";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("ERROR", error);
        setError("Failed to fetch tasks");
        setIsLoading(false);
      });
  }, []);

  const handleTaskCreate = () => {
    if (!newTask) {
      return;
    }

    setIsLoading(true);
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
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("ERROR", error);
        setError("Failed to create task");
        setIsLoading(false);
      });
  };

  const handleTaskDelete = (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedTasks = tasks.filter((task) => task.id !== data.id);
        setTasks(updatedTasks);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("ERROR", error);
        setError("Failed to delete task");
        setIsLoading(false);
      });
  };

  const handleTaskPriority = (taskId, priority) => {
    setIsLoading(true);
    fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priority: priority,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedTasks = tasks.map((task) => {
          if (task.id === data.id) {
            return { ...task, priority: data.priority };
          }
          return task;
        });
        setTasks(updatedTasks);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("ERROR", error);
        setError("Failed to update task priority");
        setIsLoading(false);
      });
  };

  const handleTaskComplete = (taskId, completed) => {
    setIsLoading(true);
    fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: completed,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedTasks = tasks.map((task) => {
          if (task.id === data.id) {
            return { ...task, completed: data.completed };
          }
          return task;
        });
        setTasks(updatedTasks);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("ERROR", error);
        setError("Failed to update task completion status");
        setIsLoading(false);
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
        <button disabled={!newTask} onClick={handleTaskCreate}>
          {isLoading ? "Creating Task..." : "Create Task"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {isLoading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        tasks.map((task) => (
          <div className="task" key={task.id}>
            <span>{task.description}</span>
            <div>
              <button
                onClick={() => handleTaskPriority(task.id, !task.priority)}
              >
                {task.priority ? "Low Priority" : "High Priority"}
              </button>
              <button
                onClick={() => handleTaskComplete(task.id, !task.completed)}
              >
                {task.completed ? "Mark Incomplete" : "Mark Complete"}
              </button>
              <button onClick={() => handleTaskDelete(task.id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </main>
  );
};

export default App;
