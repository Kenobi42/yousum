
function loadBackground() {
	// envoit d'un message au background pour indiquer que la popup est chargée
	console.log('Chargement')
	chrome.runtime.sendMessage({popupOpen: true});
}

/* Détection du chargement de la Popup */
document.addEventListener("DOMContentLoaded", function() {
	console.log("La popup est chargée.");

	// Appel au background pour injecter le content
	loadBackground();
});
