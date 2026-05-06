const btnHome = document.getElementById("btn-home");

if (btnHome) {
  btnHome.addEventListener("click", () => {
    location.href = "/";
  });
}