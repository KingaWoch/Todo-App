// TOGGLE THEME
const themeToggleBtn = document.querySelector(".theme-toggle");
const container = document.querySelector(".container");
themeToggleBtn.addEventListener("click", () => {
    if (container.classList.contains("dark-theme")) {
        container.classList.remove("dark-theme");
        container.classList.add("light-theme");
    }
    else {
        container.classList.add("dark-theme");
        container.classList.remove("light-theme");
    }
});
// TASK LIST
const form = document.querySelector("form");
const taskInput = document.querySelector("#task-input");
const tasksContainer = document.querySelector(".tasks");
const leftItems = document.querySelector(".left-items");
const statesButtons = document.querySelector(".states-btns");
const clearCompletedBtn = document.querySelector("#clear-completed-btn");
// EVENT LISTENERS
form.addEventListener("submit", addTask);
tasksContainer.addEventListener("click", changeState);
statesButtons.addEventListener("click", filterTasks);
clearCompletedBtn.addEventListener("click", clearCompleted);
countLeftItems();
// ADD TASK FUNCTION
function addTask(e) {
    e.preventDefault();
    const taskElement = document.createElement("li");
    taskElement.classList.add("task");
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
    const item = e.target;
    // DELETE TASK
    if (item.classList[0] === "clear") {
        const task = item.parentElement;
        task.remove();
    }
    // MARK AS DONE
    if (item.classList[0] === "check") {
        const task = item.parentElement;
        task.classList.toggle("completed");
    }
    if (item.classList[0] === "task") {
        item.classList.toggle("completed");
    }
    countLeftItems();
}
// FILTER TASKS FUNCTION
function filterTasks(e) {
    const tasks = tasksContainer.querySelectorAll("li");
    console.log(tasks);
    tasks.forEach((task) => {
        switch (e.target.value) {
            case "all":
                task.style.display = "flex";
                break;
            case "active":
                if (!task.classList.contains("completed")) {
                    task.style.display = "flex";
                }
                else {
                    task.style.display = "none";
                }
                break;
            case "completed":
                if (task.classList.contains("completed")) {
                    task.style.display = "flex";
                }
                else {
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
    tasks.forEach((task) => {
        if (task.classList.contains("completed")) {
            task.remove();
        }
    });
    countLeftItems();
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
