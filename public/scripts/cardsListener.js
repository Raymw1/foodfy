const cards = document.querySelectorAll(".recipe-card");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    const recipeId = card.getAttribute("id");
    window.location.href = `/recipes/${recipeId}`;
  });
});
