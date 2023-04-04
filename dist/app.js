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
