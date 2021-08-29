const newFieldBtns = document.querySelectorAll("a.new-field");
newFieldBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const lastInput = btn.previousElementSibling.lastElementChild;
    if (lastInput.value.trim() === "") {
      lastInput.setAttribute("placeholder", "Por favor, insira o campo atual");
    } else {
      const newInput = lastInput.cloneNode(true);
      btn.previousElementSibling.append(newInput);
      btn.previousElementSibling.lastElementChild.value = "";
    }
  });
});

document
  .querySelector("button[type=submit].block-delete")
  ?.addEventListener("click", () => {
    alert("Você não pode deletar este usuário. Ele possui receitas!");
  });
