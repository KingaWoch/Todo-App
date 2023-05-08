// TOGGLE THEME

const themeToggleBtn: HTMLButtonElement =
  document.querySelector(".theme-toggle");
const container: HTMLDivElement = document.querySelector(".container");

themeToggleBtn.addEventListener("click", () => {
  if (container.classList.contains("dark-theme")) {
    container.classList.remove("dark-theme");
    container.classList.add("light-theme");
  } else {
    container.classList.add("dark-theme");
    container.classList.remove("light-theme");
  }
});

// TASK LIST

const form: HTMLFormElement = document.querySelector("form");
const taskInput: HTMLInputElement = document.querySelector("#task-input");
const tasksContainer: HTMLElement = document.querySelector(".tasks");
const leftItems: HTMLElement = document.querySelector(".left-items");
const statesButtons: HTMLElement = document.querySelector(".states-btns");
const clearCompletedBtn: HTMLButtonElement = document.querySelector(
  "#clear-completed-btn"
);

interface Task {
  name: string;
  done: boolean;
}

const tasks: Task[] = JSON.parse(localStorage.getItem("tasks")) || [];
// [
//   { name: "Complete online JavaScript course", done: true },
//   { name: "Jog around the park x3", done: false },
//   { name: "10 minutes meditation", done: false },
//   { name: "Read for 1 hour", done: false },
//   { name: "Pick up groceries", done: false },
//   { name: "Complete Todo App on Frontend Mentor", done: false },
// ];

// RENDER TASK LIST

const renderTaskList = () => {
  tasksContainer.innerHTML = "";

  tasks.forEach((task) => {
    const taskElement: HTMLElement = document.createElement("li");
    taskElement.classList.add("task");
    taskElement.setAttribute("draggable", "true");
    taskElement.innerHTML = `
    <div class="check">
       <img src="images/icon-check.svg" alt="Mark as done" />
     </div>
     ${task.name}
     <button type="button" class="clear">
       <img src="images/icon-cross.svg" alt="Clear" />
     </button>
    `;

    // CHANGE STATE

    if (task.done) {
      taskElement.classList.add("completed");
    }
    taskElement.addEventListener("click", () => {
      if (taskElement.classList.contains("completed")) {
        taskElement.classList.remove("completed");
        task.done = false;
      } else {
        taskElement.classList.add("completed");
        task.done = true;
      }
      countLeftItems();
      localStorage.setItem("tasks", JSON.stringify(tasks));
    });
    tasksContainer.appendChild(taskElement);
  });
};
renderTaskList();

// ADD TASK FUNCTION

const addTask = (task: Task) => {
  tasks.push(task);
};

form.addEventListener("submit", (event: Event) => {
  event.preventDefault();
  addTask({ name: taskInput.value, done: false });
  taskInput.value = "";
  renderTaskList();
  countLeftItems();
  dragAndDrop();
  localStorage.setItem("tasks", JSON.stringify(tasks));
});

// LEFT ITEMS

function countLeftItems() {
  const tasks = tasksContainer.querySelectorAll("li");

  leftItems.innerHTML = tasks.length + " items left";
}
countLeftItems();

// DELETE TASK
const deleteTask = (e) => {
  const item: HTMLElement = e.target;
  //console.log(item);
  if (item.classList[0] === "clear") {
    const task: HTMLElement = item.parentElement;
    task.remove();
  }
  countLeftItems();
};

// FILTER TASKS FUNCTION

const filterTasks = (e) => {
  const tasks = document.querySelectorAll("li");
  tasks.forEach((task) => {
    switch (e.target.value) {
      case "all":
        task.style.display = "flex";
        break;
      case "active":
        if (!task.classList.contains("completed")) {
          task.style.display = "flex";
        } else {
          task.style.display = "none";
        }
        break;
      case "completed":
        if (task.classList.contains("completed")) {
          task.style.display = "flex";
        } else {
          task.style.display = "none";
        }
        break;
    }
  });
  countLeftItems();
};

// CLEAR COMPLETED FUNCTION

function clearCompleted() {
  const tasks = tasksContainer.querySelectorAll("li");
  tasks.forEach((task) => {
    if (task.classList.contains("completed")) {
      task.remove();
    }
  });
  countLeftItems();
}

// DRAG AND DROP

const dragAndDrop = () => {
  const tasks = tasksContainer.querySelectorAll("li");
  tasks.forEach((task) => {
    task.addEventListener("dragstart", () => {
      task.classList.add("dragging");
    });
    task.addEventListener("dragend", () => {
      task.classList.remove("dragging");
    });
    tasksContainer.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(tasksContainer, e.clientY);
      const task = document.querySelector(".dragging");
      if (afterElement == null) {
        tasksContainer.appendChild(task);
      } else {
        tasksContainer.insertBefore(task, afterElement);
      }
    });
  });
};

dragAndDrop();

function getDragAfterElement(tasksContainer, y) {
  const draggableElement = [
    ...tasksContainer.querySelectorAll(".task:not(.dragging)"),
  ];

  return draggableElement.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// EVENT LISTENERS

tasksContainer.addEventListener("click", deleteTask);
statesButtons.addEventListener("click", filterTasks);
clearCompletedBtn.addEventListener("click", clearCompleted);
