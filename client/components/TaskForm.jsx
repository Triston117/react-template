import React from "react";

const TaskForm = ({
  newTask = "",
  setNewTask,
  dueDate = null, // Set initial value to null
  setDueDate,
  onCreateTask,
}) => {
  const handleAddTask = () => {
    const taskDate = new Date(dueDate); // Convert dueDate to a Date object
    onCreateTask(newTask, taskDate);
  };

  return (
    <div className="task-form">
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />

      <input
        type="date"
        value={dueDate || ""}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
};

export default TaskForm;
