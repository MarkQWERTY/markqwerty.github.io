var fullscreenButton = document.getElementById("fullscreenButton");

window.onload=function(){
  enterFullscreen()
}
// Verificar si la API Fullscreen es compatible con el navegador
if (document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled) {

  // Agregar el evento de clic al botón
  fullscreenButton.addEventListener("mouseover", function(){
    enterFullscreen();
  });
}

// Función para alternar entre el modo de pantalla completa
function toggleFullscreen() {
  if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
    exitFullscreen(); // Salir del modo de pantalla completa si ya está activo
  } else {
    enterFullscreen(); // Activar el modo de pantalla completa si no está activo
  }
}

// Función para entrar en el modo de pantalla completa
function enterFullscreen() {
  var element = document.documentElement; // Elemento a poner en pantalla completa

  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

// Función para salir del modo de pantalla completa
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}