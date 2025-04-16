/* Injection du fichier JS dans l'onglet actif */



/* Détecte le chargement d'une nouvelle page */
console.log("Nouvelle page chargée.");
// Selection de l'emplacement dans la Section Commentaire pour intégrer le bouton de résumé
var comments = document.querySelector("ytd-comments#comments");
var sections = comments.querySelector("ytd-item-section-renderer#sections");
var header = sections.querySelector("div#header");
// Création du bouton de résumé
var div = document.createElement("div");
div.setAttribute("id", "yousum");
div.setAttribute("style", "text-align: center; margin-bottom:50px;");
const box = `
	<button id="yousumbutton" style="border-radius: 42px; background-color:#00000000; color:white; border-color:white;">
	    <h1 style="margin:15px;"><b>Résumé</b> les commentaires avec l'<b>IA</b></h1>
	</button>`;
div.innerHTML = box;
// Injection de la div#yousum 
header.after(div);
console.log("Injection du div#yousum")

window.addEventListener('load', function() {
	console.log("Changement de page");
});



// Sélection du bouton yousum à surveiller
var comments = document.querySelector("ytd-comments#comments");
var sections = comments.querySelector("ytd-item-section-renderer#sections");
var yousum = sections.querySelector("div#yousum");
var button = yousum.querySelector("button#yousumbutton");
// Détection quand le bouton pour résumé est clické (à améliorer)
button.addEventListener("click", function() {
	console.log("Bouton cliqué !");

	// On établi la connexion avec le background
	var port = chrome.runtime.connect({name: "content-background"});
	// On envoit la demande au background
	port.postMessage({getSummaryBackground: true});
	// Détection d'un message venant du background	
	port.onMessage.addListener(function(message) {
		console.log("Message reçu du background");
		if (message.summary) {
			console.log("Réception du résumé.")
			var summary = message.summary;

			// Selection du div yousum pour intégrer le résumé
			var comments = document.querySelector("ytd-comments#comments");
			var sections = comments.querySelector("ytd-item-section-renderer#sections");
			var yousum = sections.querySelector("div#yousum");
			yousum.setAttribute("style", "margin-bottom:50px; margin-left:55px; margin-right:42px;");
			yousum.innerHTML="";

			// Création du titre du résumé
			var h1 = document.createElement("h1");
			h1.setAttribute("style", "color:white;");
			h1.innerHTML="Résumé IA";
			yousum.appendChild(h1);

			// Création du paragraphe du résumé
			var p = document.createElement("p");
			p.setAttribute("style", "color:white; font-size:14px;");
			p.innerHTML=summary;
			yousum.appendChild(p);
		}
	});
});
