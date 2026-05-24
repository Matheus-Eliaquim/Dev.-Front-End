const hamburger = document.querySelector(".hamburger");

const navbar = document.querySelector(".navbar");

const navLinks = document.querySelectorAll(".navbar a");

hamburger.addEventListener("click", () => navbar.classList.toggle("active"));

hamburger.addEventListener("click", () => hamburger.classList.toggle("active"));

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navbar.classList.remove("active");
    hamburger.classList.remove("active");
  });
});



