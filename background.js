// Fichier JavaScript d'arrière plan de l'extension */


/* Détecte la réception de messages depuis le popup */ 
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	console.log("Background message from popup");
	if (message.popupOpen) {
		chrome.tabs.query({active: true}, function(tabs) {
			// Injection du content
			console.log("Injection du content")
			chrome.scripting.executeScript({
				target: {tabId: tabs[0].id , allFrames: false},
				files: ["inject.js"]
			});
		});
  	}
});


/* Détecte la réception de messages depuis le content */ 
chrome.runtime.onConnect.addListener(function(port) {
  console.log("Connecté au content.");
  port.onMessage.addListener(function(message) {
    console.log("Message reçu du content");
  	if (message.getSummaryBackground) {
  		// Obtention de l'URL YouTube
		chrome.tabs.query({active: true, currentWindow: true}, tabs => {
		    let url = tabs[0].url; // tabs[0] est l'onglet actif
		    console.log("Analyse de l'URL.");
		    const url_code = url.split("?v=")[1]

		    // Requête Fetch API pour obtenir le résumé des commentaires de la vidéo (yousum.py)
		    var url_api = "https://www.exoplanetes.fr/yousum/"+url_code;
			const request = new Request(url_api, {method: "GET"});
			fetch(request)
				.then(response => response.json())
				.then(response => {
					console.log(response["summary"]);
					// On récupère le résumé
					var summary = response["summary"];
					// Envoit du résumé au content
					port.postMessage({summary: summary});
				})
				.catch(error => console.log('Error:', error));
		});
  	}
  });
});