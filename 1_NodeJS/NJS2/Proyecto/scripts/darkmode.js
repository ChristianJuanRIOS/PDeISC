const btn = document.getElementById("toggleDark");
const icon = btn.querySelector("i");
const body = document.body;

if (localStorage.getItem("darkMode") === "true") {
  body.classList.add("dark");
  icon.className = "fa-solid fa-sun";
}

btn.addEventListener("click", () => {
  body.classList.toggle("dark");

  let dark = body.classList.contains("dark");
  localStorage.setItem("darkMode", dark);

  icon.className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
});

btn.addEventListener("mouseenter", () => {
  icon.classList.add("fa-beat");
});

btn.addEventListener("mouseleave", () => {
  icon.classList.remove("fa-beat");
});

btn.addEventListener("touchstart", () => {
  icon.classList.add("fa-shake");
});

btn.addEventListener("touchend", () => {
  icon.classList.remove("fa-shake");
});