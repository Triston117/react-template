import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlus, FaTrash, FaCheck } from "react-icons/fa";
import "../app.css";
import "bootstrap/dist/css/bootstrap.min.css";
import RandomQuote from "./RandomQuote.jsx";
import TaskForm from "./TaskForm.jsx";
import Task from "./Task.jsx";
import YouTube from "react-youtube";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [randomQuote, setRandomQuote] = useState(null);

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

  const handleNewQuote = () => {
    getNewQuote();
  };

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

  const handlePlayMusic = () => {
    const audioElement = document.getElementById("audio-element");
    audioElement.play();
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
      <button className="btn btn-primary" onClick={handlePlayMusic}>
        Play Ambient Music
      </button>
      <audio
        id="audio-element"
        src="https://www.youtube.com/watch?v=nRe3xFeyhVY"
      />
    </div>
  );
};

export default App;
