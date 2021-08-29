const currentPage = location.pathname;
const menuItems = document.querySelectorAll("header nav ul li a");

menuItems.forEach((menuItem) => {
  if (currentPage.includes(menuItem.getAttribute("href"))) {
    menuItem.classList.add("active");
  } else {
    menuItem.classList.remove("active");
  }
});
