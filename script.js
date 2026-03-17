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

/* scroll anim */
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

/* mouse light */
document.addEventListener("mousemove", e => {
  document.body.style.setProperty("--x", e.clientX + "px");
  document.body.style.setProperty("--y", e.clientY + "px");
});

/* freccia liquida */
const path = document.getElementById("arrowPath");

const shapes = [
  "M20 10 C22 20, 28 25, 20 35 C12 25, 18 20, 20 10 Z",
  "M20 10 C25 20, 30 30, 20 40 C10 30, 15 20, 20 10 Z"
];

let j = 0;

setInterval(() => {
  j = (j + 1) % shapes.length;
  path.setAttribute("d", shapes[j]);
}, 800);

path.setAttribute("d", shapes[0]);

/* scroll click */
document.querySelector(".scroll-indicator").addEventListener("click", () => {
  window.scrollTo({
    top: window.innerHeight,
    behavior: "smooth"
  });
});