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

// EVENT LISTENERS

form.addEventListener("submit", addTask);
tasksContainer.addEventListener("click", changeState);
statesButtons.addEventListener("click", filterTasks);
clearCompletedBtn.addEventListener("click", clearCompleted);
countLeftItems();

// ADD TASK FUNCTION

function addTask(e: Event) {
  e.preventDefault();
  const taskElement: HTMLElement = document.createElement("li");
  taskElement.classList.add("task");
  taskElement.setAttribute("draggable", "true");
  taskElement.innerHTML = `
    <div class="check">
      <img src="images/icon-check.svg" alt="Mark as done" />
    </div>
      ${taskInput.value}
    <button type="button" class="clear">
      <img src="images/icon-cross.svg" alt="Clear" />
    </button>`;
  tasksContainer.appendChild(taskElement);

  taskInput.value = "";
  // ADD TASKS TO LOCALSTORAGE
  // saveLocalTasks(taskInput.value);
  countLeftItems();
}

// CHANGE STATE FUNCTION

function changeState(e) {
  const item: HTMLElement = e.target;

  // DELETE TASK

  if (item.classList[0] === "clear") {
    const task: HTMLElement = item.parentElement;
    task.remove();
  }

  // MARK AS DONE

  if (item.classList[0] === "check") {
    const task: HTMLElement = item.parentElement;
    task.classList.toggle("completed");
  }

  if (item.classList[0] === "task") {
    item.classList.toggle("completed");
  }
  countLeftItems();
}

// FILTER TASKS FUNCTION
let tasks = tasksContainer.querySelectorAll("li");

function filterTasks(e) {
  console.log(tasks);
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
}

// LEFT ITEMS

function countLeftItems() {
  const tasks = tasksContainer.querySelectorAll("li");
  leftItems.innerHTML = tasks.length + " items left";
}

// CLEAR COMPLETED FUNCTION

function clearCompleted(e) {
  const tasks = tasksContainer.querySelectorAll("li");
  console.log(tasks);
  tasks.forEach((task) => {
    if (task.classList.contains("completed")) {
      task.remove();
    }
  });
  countLeftItems();
}

// DRAG AND DROP

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

// LOCAL STORAGE

// function saveLocalTasks(task) {
//   let tasks;
//   if (localStorage.getItem("tasks") === null) {
//     tasks = [];
//   } else {
//     tasks = JSON.parse(localStorage.getItem("tasks"));
//   }
//   tasks.push(task);
//   localStorage.setItem("tasks", JSON.stringify("tasks"));
// }
