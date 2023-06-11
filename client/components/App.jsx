import React, { useEffect, useState } from "react";

const App = () => {
  const [tasks, setTasks] = useState([]);

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

  return (
    <main>
      {tasks.map((task) => (
        <span className="task" key={task.id}>
          {task.description}
        </span>
      ))}
    </main>
  );
};

export default App;
