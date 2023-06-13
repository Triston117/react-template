import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlus, FaTrash, FaCheck } from "react-icons/fa";
import "../app.css";
import "bootstrap/dist/css/bootstrap.min.css";
import RandomQuote from "./RandomQuote.jsx";
import TaskForm from "./TaskForm.jsx";
import Task from "./Task.jsx";

const App = () => {
  // State
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [randomQuote, setRandomQuote] = useState(null);

  // Initial data fetch and quote fetch
  useEffect(() => {
    fetchQuotes();
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

  // Fetch quotes from API
  const fetchQuotes = async () => {
    try {
      const response = await fetch("https://type.fit/api/quotes");
      const data = await response.json();
      setQuotes(data);
      let randIndex = Math.floor(Math.random() * data.length);
      setRandomQuote(data[randIndex]);
    } catch (error) {
      console.error("Failed to fetch quotes:", error);
    }
  };

  // Handle new quote button click
  const handleNewQuote = () => {
    getNewQuote();
  };

  // Get a new random quote
  const getNewQuote = () => {
    const colors = [
      "#808080",
      "#A9A9A9",
      "#696969",
      "#C0C0C0",
      "#DCDCDC",
      "#D3D3D3",
    ];
    let randIndex = Math.floor(Math.random() * quotes.length);
    let randColorIndex = Math.floor(Math.random() * colors.length);
    setRandomQuote(quotes[randIndex]);
  };

  // Get a random color
  const getRandomColor = () => {
    const colors = [
      "#FF0000",
      "#00FF00",
      "#0000FF",
      "#FF00FF",
      "#00FFFF",
      "#FFFF00",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  // Create a new task
  const handleTaskCreate = (newTask, dueDate) => {
    setIsLoading(true);

    let taskName = newTask;
    if (dueDate) {
      const formattedDate = new Date(dueDate).toLocaleDateString();
      taskName += " " + formattedDate;
    }

    let requestBody = {
      description: taskName,
    };

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

  // Delete a task
  const handleTaskDelete = (taskId) => {
    setIsLoading(true);

    fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          const updatedTasks = tasks.filter((task) => task.id !== taskId);
          setTasks(updatedTasks);
        } else {
          setError("Failed to delete task");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("ERROR", error);
        setError("Failed to delete task");
        setIsLoading(false);
      });
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <RandomQuote
        quote={randomQuote}
        onNewQuote={handleNewQuote}
        color={getRandomColor()}
      />
      <TaskForm
        newTask={newTask}
        setNewTask={setNewTask}
        dueDate={dueDate}
        setDueDate={setDueDate}
        onCreateTask={handleTaskCreate}
      />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {tasks.map((task) => (
            <Task key={task.id} task={task} onDeleteTask={handleTaskDelete} />
          ))}
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default App;
