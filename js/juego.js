// Variables globales
const puntero = document.getElementById("puntero");
let numeroMeteoritos = 5;
let relojMeteoritos = null;
let relojTiempo = null;
let relojFuera = null;
let tiempo = 0;
const sonidoExplosion = new Audio("sonidos/explosion.mp3");
const musica = new Audio("sonidos/musica.mp3");
musica.loop = true;
const capsula = new Audio("sonidos/capsula.mp3");
let iniciadoJuego = false;
let record = localStorage.getItem("record") ? localStorage.getItem("record") : 0;
document.getElementById("record").textContent = record;


document.addEventListener("mousemove", (e) => {
  puntero.style.left = e.clientX + "px";
  puntero.style.top = e.clientY + "px";
});

function eliminarMeteorito(meteorito) {
  meteorito.remove();
}

function crearMeteoritos() {
  if (tiempo % 10) {
    numeroMeteoritos++;
  }
  // Math.floor(Math.random() * (max - min + 1) + min);
  let numero = Math.floor(Math.random() * (numeroMeteoritos - 1) + 1);

  for (let i = 0; i < numero; i++) {
    const div = document.createElement("div");
    div.classList.add("meteorito");
    div.style.left = Math.floor(Math.random() * (120 - 100) + 100) + "vw";
    div.style.top = Math.floor(Math.random() * 99) + "vh";
    //////div.addEventListener("animationend", () => div.remove());
    div.addEventListener("animationend", () => eliminarMeteorito(div));
    div.style.width = Math.floor(Math.random() * (128 - 32) + 32) + "px";
    div.style.animationDuration =
      (Math.random() * (3 - 1) + 1).toFixed(1) + "s";
    div.addEventListener("mousemove", impacto);
    document.body.appendChild(div);
  }
  crearCapsula();
}

function capsulaCapturada(evt) {
  numeroMeteoritos /= 2;
  capsula.play();
  if (numeroMeteoritos < 5) {
    numeroMeteoritos = 5;
  }
  evt.currentTarget.remove();
}

function crearCapsula() {
  numero = Math.floor(Math.random() * 5) + 1;
  if (numero == 5) {
    const div = document.createElement("div");
    div.classList.add("capsula");
    div.style.left = Math.floor(Math.random() * (120 - 100) + 100) + "vw";
    div.style.top = Math.floor(Math.random() * 99) + "vh";
    div.addEventListener("mouseenter", capsulaCapturada);
    document.body.appendChild(div);
  }
}

function impacto() {
  clearInterval(relojMeteoritos);
  clearInterval(relojTiempo);
  relojMeteoritos = null;
  relojTiempo = null;
  document.getElementById("puntero").src = "imagenes/explosion.png";
  // hoy día los navegadores impiden por defecto reproducir sonido si el usuario no ha interactuado con la página (como
  // un click) no valiendo mover el ratón sobre ella. Como nuestro juego tiene botón iniciar, para hacer clic, no
  // tendremos problema
  sonidoExplosion.play();
  musica.pause();
  document.getElementById("iniciar").style.display = "block";
  document.body.style.backgroundImage = "url(imagenes/espacioGris.jpg)";
  iniciadoJuego = false;
  if(tiempo > record) {
    localStorage.setItem("record", tiempo);
    document.getElementById("record").textContent = tiempo;
  }
}

function incrementarTiempo() {
  tiempo++;
  document.getElementById("tiempo").textContent = tiempo;
}

document.body.addEventListener("keydown", (evt) => {
  if (evt.key == "s") {
    /*  if(musica.paused) {
            musica.play();
        } else {
            musica.pause();
        */
    if (musica.volume == 0) {
      /* entre 0 y 1 */
      musica.volume = 1;
      sonidoExplosion.volume = 1;
      capsula.volumne = 1;
      document
        .getElementById("iconoSonido")
        .classList.remove("bi-volume-off-fill");
      document.getElementById("iconoSonido").classList.add("bi-volume-up-fill");
    } else {
      musica.volume = 0;
      sonidoExplosion.volume = 0;
      capsula.volume = 0;
      document
        .getElementById("iconoSonido")
        .classList.remove("bi-volume-up-fill");
      document
        .getElementById("iconoSonido")
        .classList.add("bi-volume-off-fill");
    }
  }
});

function iniciar(evt) {
  evt.currentTarget.style.display = "none";
  document.querySelector("#puntero").src = "imagenes/cohete.png";
  relojMeteoritos = setInterval(crearMeteoritos, 1000);
  relojTiempo = setInterval(incrementarTiempo, 500);
  musica.play();
  tiempo = 0;
  numeroMeteoritos = 5;
  iniciadoJuego = true;
  document.getElementById("tiempo").textContent = 0;
  document.body.style.backgroundImage = "url(imagenes/espacio.jpg)";
  requestAnimationFrame(comprobar);
}

function comprobar() {
    const rectNave = puntero.getBoundingClientRect();

    Array.from(document.getElementsByClassName("meteorito")).forEach((m) => {
        const recMeteo = m.getBoundingClientRect();

        const noColisionan =
            rectNave.right < recMeteo.left ||
            rectNave.left > recMeteo.right ||
            rectNave.bottom < recMeteo.top ||
            rectNave.top > recMeteo.bottom;
        if(noColisionan == false) {
            impacto();
        }
    });
    // Debemos llamar de nuevo a este método al final de la función
    requestAnimationFrame(comprobar);
}

document.getElementById("iniciar").addEventListener("click", iniciar);

// NO podemos usar mouseleave ni mouseneter con el document
document.addEventListener("mouseout", function (evt) {
  // Si no hay relatedTarget o es HTML, el puntero ha salido de la ventana
  if (!evt.relatedTarget || evt.relatedTarget.nodeName === "HTML") {
    /* clearInterval(relojMeteoritos);
        clearInterval(relojTiempo);
        relojMeteoritos = null;
        relojTiempo = null;
       relojFuera = setTimeout(() =>  impacto(), 200);*/
    impacto();
  }
});


/*document.addEventListener("mouseover", function (evt) {
  if (!evt.relatedTarget || evt.relatedTarget.nodeName === "HTML") {
    if (relojMeteoritos == null && iniciadoJuego) {
      relojMeteoritos = setInterval(crearMeteoritos, 1000);
    }
    if (relojTiempo == null && iniciadoJuego) {
      relojTiempo = setInterval(incrementarTiempo, 500);
    }
    /* if(relojFuera != null) {
            clearInterval(relojFuera);
            relojFuera = null;
        }*/
 /* }
});*/

window.addEventListener("blur", () => {
  clearInterval(relojMeteoritos);
  clearInterval(relojTiempo);
  relojMeteoritos = null;
  relojTiempo = null;
  Array.from(document.getElementsByClassName("meteorito")).forEach((m) => {
    m.removeEventListener("animationend", eliminarMeteorito);
    m.style.animationPlayState = "paused";
  });
});

window.addEventListener("focus", () => {
  if (relojMeteoritos == null && iniciadoJuego) {
    relojMeteoritos = setInterval(crearMeteoritos, 1000);
    relojTiempo = setInterval(incrementarTiempo, 500);
    Array.from(document.getElementsByClassName("meteorito")).forEach((m) => {
      m.style.animationPlayState = "running";
      m.addEventListener("animationend", eliminarMeteorito);
    });
  }
});
