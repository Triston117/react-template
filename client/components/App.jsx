import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dueDate, setDueDate] = useState(null);

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
    const requestBody = {
      description: newTask,
    };
    if (dueDate) {
      requestBody.dueDate = dueDate.toISOString();
    }

    fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedTasks = [...tasks, data];
        setTasks(updatedTasks);
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

    // Determine the priority value based on the current state
    const priorityValue = priority ? 1 : 2;

    fetch(`/api/tasks/${taskId}/priority`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priority: priorityValue,
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

        // Move the task to the top if the priority was changed to high
        if (!priority) {
          const taskIndex = updatedTasks.findIndex(
            (task) => task.id === data.id
          );
          if (taskIndex !== -1) {
            const [task] = updatedTasks.splice(taskIndex, 1);
            task.priority = 1; // Set priority to high
            updatedTasks.unshift(task);
          }
        }

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
    fetch(`/api/tasks/${taskId}/completion`, {
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

  const handleTaskDueDate = (taskId, dueDate) => {
    setIsLoading(true);
    fetch(`/api/tasks/${taskId}/dueDate`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dueDate: dueDate ? dueDate.toISOString().split("T")[0] : null,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedTasks = tasks.map((task) => {
          if (task.id === data.id) {
            return { ...task, dueDate: data.dueDate };
          }
          return task;
        });
        setTasks(updatedTasks);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("ERROR", error);
        setError("Failed to update task due date");
        setIsLoading(false);
      });
  };

  return (
    <main>
      <div className="task-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter task description"
        />
        <DatePicker
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          placeholderText="Select due date"
        />
        <button onClick={handleTaskCreate}>Add Task</button>
      </div>

      {error && <div className="error">{error}</div>}

      {isLoading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        tasks.map((task) => (
          <div
            className={`task ${task.completed ? "completed" : ""}`}
            key={task.id}
          >
            <span className="task-description">{task.description}</span>{" "}
            <span>Due: {task.dueDate ? task.dueDate : ""}</span>
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
              <DatePicker
                selected={task.dueDate ? new Date(task.dueDate) : null}
                onChange={(date) => handleTaskDueDate(task.id, date)}
                placeholderText="Select due date"
              />
              <button onClick={() => handleTaskDelete(task.id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </main>
  );
};

export default App;
