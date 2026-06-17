const navToggle = document.getElementById("navToggle");
const menu = document.getElementById("menu");

function toggleMenu(force) {
    const shouldShow =
        typeof force === "boolean"
            ? force
            : !menu.classList.contains("show");

    menu.classList.toggle("show", shouldShow);
    navToggle.setAttribute("aria-expanded", String(shouldShow));
}

navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
});

document.addEventListener("click", (e) => {
    const insideMenu =
        menu.contains(e.target) ||
        navToggle.contains(e.target);

    if (!insideMenu && menu.classList.contains("show")) {
        toggleMenu(false);
    }
});

document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
        toggleMenu(false);
    });
});