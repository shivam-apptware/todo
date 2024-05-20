import React, { useState, useEffect } from "react";
import "./App.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TaskIcon from "@mui/icons-material/Task";
import ScheduleIcon from "@mui/icons-material/Schedule";

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [isInProgressScreen, setIsInProgressScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [inProgressTodos, setInProgressTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState("");
  const [currentEditedItem, setCurrentEditedItem] = useState("");

  const handleAddTodo = () => {
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
    };

    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    setTodos(updatedTodoArr);
    localStorage.setItem("todolist", JSON.stringify(updatedTodoArr));
  };

  const handleDeleteTodo = (index) => {
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1);

    localStorage.setItem("todolist", JSON.stringify(reducedTodo));
    setTodos(reducedTodo);
  };

  const handleComplete = (index, fromInProgress = false) => {
    let filteredItem;
    let updatedInProgressArr;
    if (fromInProgress) {
      filteredItem = { ...inProgressTodos[index] };
      updatedInProgressArr = [...inProgressTodos];
      updatedInProgressArr.splice(index, 1);
      setInProgressTodos(updatedInProgressArr);
      localStorage.setItem(
        "inProgressTodos",
        JSON.stringify(updatedInProgressArr)
      );
    } else {
      filteredItem = { ...allTodos[index] };
      handleDeleteTodo(index);
    }

    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push(filteredItem);
    setCompletedTodos(updatedCompletedArr);
    localStorage.setItem("completedTodos", JSON.stringify(updatedCompletedArr));
  };

  const handleMoveToInProgress = (index) => {
    let filteredItem = { ...allTodos[index] };

    let updatedInProgressArr = [...inProgressTodos];
    updatedInProgressArr.push(filteredItem);
    setInProgressTodos(updatedInProgressArr);
    handleDeleteTodo(index);
    localStorage.setItem(
      "inProgressTodos",
      JSON.stringify(updatedInProgressArr)
    );
  };

  const handleDeleteCompletedTodo = (index) => {
    let reducedTodo = [...completedTodos];
    reducedTodo.splice(index, 1);

    localStorage.setItem("completedTodos", JSON.stringify(reducedTodo));
    setCompletedTodos(reducedTodo);
  };

  const handleDeleteInProgressTodo = (index) => {
    let reducedTodo = [...inProgressTodos];
    reducedTodo.splice(index, 1);

    localStorage.setItem("inProgressTodos", JSON.stringify(reducedTodo));
    setInProgressTodos(reducedTodo);
  };

  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem("todolist"));
    let savedCompletedTodo = JSON.parse(localStorage.getItem("completedTodos"));
    let savedInProgressTodo = JSON.parse(
      localStorage.getItem("inProgressTodos")
    );
    if (savedTodo) {
      setTodos(savedTodo);
    }

    if (savedCompletedTodo) {
      setCompletedTodos(savedCompletedTodo);
    }

    if (savedInProgressTodo) {
      setInProgressTodos(savedInProgressTodo);
    }
  }, []);

  const handleEdit = (ind, item) => {
    console.log(ind);
    setCurrentEdit(ind);
    setCurrentEditedItem(item);
  };

  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, title: value };
    });
  };

  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, description: value };
    });
  };

  const handleUpdateToDo = () => {
    let newToDo = [...allTodos];
    newToDo[currentEdit] = currentEditedItem;
    setTodos(newToDo);
    setCurrentEdit("");
    localStorage.setItem("todolist", JSON.stringify(newToDo));
  };

  return (
    <div className="App">
      <h1>My Todos</h1>

      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's the task title?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What's the task description?"
            />
          </div>
          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleAddTodo}
              className="primaryBtn"
            >
              Add
            </button>
          </div>
        </div>

        <div className="btn-area">
          <button
            className={`secondaryBtn ${
              !isCompleteScreen && !isInProgressScreen && "active"
            }`}
            onClick={() => {
              setIsCompleteScreen(false);
              setIsInProgressScreen(false);
            }}
          >
            Todo
          </button>
          <button
            className={`secondaryBtn ${isInProgressScreen && "active"}`}
            onClick={() => {
              setIsCompleteScreen(false);
              setIsInProgressScreen(true);
            }}
          >
            In Progress
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen && "active"}`}
            onClick={() => {
              setIsCompleteScreen(true);
              setIsInProgressScreen(false);
            }}
          >
            Completed
          </button>
        </div>

        <div className="todo-list">
          {!isCompleteScreen &&
            !isInProgressScreen &&
            allTodos.map((item, index) => {
              if (currentEdit === index) {
                return (
                  <div className="edit__wrapper" key={index}>
                    <input
                      placeholder="Updated Title"
                      onChange={(e) => handleUpdateTitle(e.target.value)}
                      value={currentEditedItem.title}
                    />
                    <textarea
                      placeholder="Updated Description"
                      rows={4}
                      onChange={(e) => handleUpdateDescription(e.target.value)}
                      value={currentEditedItem.description}
                    />
                    <button
                      type="button"
                      onClick={handleUpdateToDo}
                      className="primaryBtn"
                    >
                      Update
                    </button>
                  </div>
                );
              } else {
                return (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>

                    <div>
                      <ScheduleIcon
                        className="icon"
                        onClick={() => handleMoveToInProgress(index)}
                        title="Move to In Progress?"
                      />
                      <TaskIcon
                        className="check-icon"
                        onClick={() => handleComplete(index)}
                        title="Complete?"
                      />
                      <EditIcon
                        className="check-icon"
                        onClick={() => handleEdit(index, item)}
                        title="Edit?"
                      />
                      <DeleteIcon
                        className="icon"
                        onClick={() => handleDeleteTodo(index)}
                        title="Delete?"
                      />
                    </div>
                  </div>
                );
              }
            })}

          {isInProgressScreen &&
            inProgressTodos.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>

                  <div>
                    <TaskIcon
                      className="check-icon"
                      onClick={() => handleComplete(index, true)}
                      title="Complete?"
                    />
                    <DeleteIcon
                      className="icon"
                      onClick={() => handleDeleteInProgressTodo(index)}
                      title="Delete?"
                    />
                  </div>
                </div>
              );
            })}

          {isCompleteScreen &&
            completedTodos.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p>
                      <small>Completed on: {item.completedOn}</small>
                    </p>
                  </div>

                  <div>
                    <DeleteIcon
                      className="icon"
                      onClick={() => handleDeleteCompletedTodo(index)}
                      title="Delete?"
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
