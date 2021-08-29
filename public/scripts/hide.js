const hideBtns = document.querySelectorAll("a.hide-info");

hideBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const elementToHide = btn.parentElement.nextElementSibling;
    if (elementToHide.classList.contains("hidden")) {
      btn.innerText = "ESCONDER";
      elementToHide.classList.remove("hidden");
    } else {
      btn.innerText = "MOSTRAR";
      elementToHide.classList.add("hidden");
    }
  });
});
