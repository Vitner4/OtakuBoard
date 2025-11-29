// Пасхалка №1: Привет от автора
easterEgg = document.getElementById('easter-egg');
let eeNum = Math.floor(Math.random() * (50 - 1 + 1)) + 1;

if(eeNum == 50) {
    console.log("Congratulations! Easter egg №1 found!");
    easterEgg.removeAttribute('hidden');
    console.log("Easter egg: Hello from Vitner4!");
}


