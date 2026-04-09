/* typing */
const text = "Cusumano Alessandro";
let i = 0;

function typing(){
  if(i < text.length){
    document.getElementById("typing").innerHTML += text[i];
    i++;
    setTimeout(typing, 100);
  }
}
typing();

/* fade scroll */
const faders = document.querySelectorAll(".fade");

window.addEventListener("scroll", () => {
  faders.forEach(el => {
    if(el.getBoundingClientRect().top < window.innerHeight - 100){
      el.classList.add("visible");
    }
  });
});

/* contatto */
function contatto(){
  alert("Grazie per aver visitato il mio portfolio!");
}

/* luce mouse */
document.addEventListener("mousemove", e => {
  document.body.style.setProperty("--x", e.clientX + "px");
  document.body.style.setProperty("--y", e.clientY + "px");
});

/* scroll click */
document.querySelector(".scroll-indicator").addEventListener("click", () => {
  window.scrollTo({
    top: window.innerHeight,
    behavior: "smooth"
  });
});