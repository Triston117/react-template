DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
  id SERIAL,
  title TEXT,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT false,
  priority INTEGER
);

INSERT INTO tasks(title, description, due_date, completed, priority) 
VALUES ('Task 1', 'Do the dishes', NULL, false, 3);

INSERT INTO tasks(title, description, due_date, completed, priority) 
VALUES ('Task 2', 'Walk the dog', NULL, false, 2);

INSERT INTO tasks(title, description, due_date, completed, priority) 
VALUES ('Task 3', 'Sweep the floor', NULL, false, 1);

INSERT INTO tasks(title, description, due_date, completed, priority) 
VALUES ('Task 4', 'Do your homework', NULL, false, 2);

INSERT INTO tasks(title, description, due_date, completed, priority) 
VALUES ('Task 5', 'Beat Elden Ring', NULL, false, 1);
