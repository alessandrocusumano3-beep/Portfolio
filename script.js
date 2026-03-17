// ✨ effetto typing nome

const text = "Cusumano Alessandro";
let i = 0;

function typing(){

if(i < text.length){

document.getElementById("typing").innerHTML += text.charAt(i);

i++;

setTimeout(typing, 100);

}

}

typing();


// 📜 animazione scroll sezioni

const faders = document.querySelectorAll(".fade");

window.addEventListener("scroll", () => {

faders.forEach(el => {

const top = el.getBoundingClientRect().top;

if(top < window.innerHeight - 100){

el.classList.add("visible");

}

});

});


// 📞 bottone contatto

function contatto(){

alert("Grazie per aver visitato il mio portfolio!");

}


// 🧠 luce che segue il mouse (EFFETTO MODERNO)

document.addEventListener("mousemove", e => {

document.body.style.setProperty("--x", e.clientX + "px");
document.body.style.setProperty("--y", e.clientY + "px");

});