import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import "../app.css";

const Task = ({ task, onDeleteTask }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleTaskComplete = () => {
    setIsCompleted(!isCompleted);
  };

  return (
    <div className="task">
      <div className={`task-details ${isCompleted ? "completed" : ""}`}>
        <p>{task.description}</p>
        <button className="task-button" onClick={handleTaskComplete}>
          {isCompleted ? "Undo" : "Complete"}
        </button>
        <button className="task-button" onClick={() => onDeleteTask(task.id)}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default Task;
