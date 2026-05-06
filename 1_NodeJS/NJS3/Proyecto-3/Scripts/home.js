const btnHome = document.getElementById("btn-home");

if (btnHome) {
  btnHome.addEventListener("click", () => {
    window.location.href = "/";
  });
}