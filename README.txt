### README - Developer ONLY ###
### Extension en cours de développement ###

YouSum est une Extension Chrome conçu pour synthétiser les commentaires de n'importe quelle vidéo YouTube et afficher ce résumé directement dans YouTube au sommet de la section des commentaires dans un cadre unique.

![screenshot](https://github.com/Kenobi42/yousum/blob/main/yousum1.jpeg?raw=true)

Pour réaliser cela, l'extension est composée de trois parties principales :
- Web scraping de la page youtube ciblée afin de récupérer les commentaires
- Appel à l'API d'OpenAI afin d'obtenir la synthèse des commentaires grâce à un prompt dynamique
- Injection JavaScript pour intégrer le résumé dans la section commentaires

Les étapes du point de vue de l'utilisateur sont :
1. Chargement de l'extension chrome (un bouton s'affiche dans la section commentaire)
2. Lancement du programme de synthèse en cliquant sur le bouton "Résumer avec l'IA"
3. Scraping des commentaires youtube et synthèse par le modèle gpt-4o-mini (invisible pour l'utilisateur)
4. Affichage du résumé des commentaires à l'emplacement précédent du bouton

A noter que l'étape 3 est en fait réalisée sur un serveur distant (en l'occurence de mon site d'astronomie www.exoplanetes.fr). Il s'agit donc d'une API auquel le code javascript fait appel à la fin de l'étape 2.
Le code python de cette API est ici présent sous le nom yousum.py. Ce code prend en entrée l'URL d'une vidéo youtube et retourne en sortie le résumé de ses commentaires. 

La récupération des commentaires YouTube est la partie la plus sensible du code car YouTube ajoute très régulièrement de nouvelles mesures pour empêcher aux bots d'accéder aux vidéos. A cause de cela, cette partie du code doit être ajustée presque toutes les semaines. Parmis les mesures de sécurité prises par YouTube, on compte :
- L'impossibilité d'accéder au code source d'une vidéo avant que la page soit entièrement chargée dans un navigateur web
- La nécessité de ressembler à un humain en incorporeant un fichier cookies.txt identique à celui d'un vrai utilisateur
- Accéder à YouTube avec une adresse IP "légitime" en paramétrant un proxy résidentiel ou un VPN premium (problème actuel)


Le fichier index.html constitue la popup de l'extension qu'il faut ouvrir pour charger le fichier script.js, qui lui même active le fichier background.js qui fait la liaison entre la popup de l'extension et la page youtube afin d'y injecter le fichier inject.js. Ce dernier ajoute au sommet de la section commentaire la division qui contient le bouton de résumer et le contenu du résumer une fois celui ci obtenu.



Ci dessous les problèmes actuels à résoudre, les idées d'amélioration, et les références utilisées.

------------------------------------------------------------------------------------------

Idées  d'amélioration :
- Ajouter un badge dans l'icon de l'extension pour montrer si l'extension est active ou inactive

------------------------------------------------------------------------------------------

Problèmes de l'extension liées à JavaScript :
- En ouvrant une vidéo dans le MEME onglet, le résumé de la vidéo précédente reste --> Il faut le remplacer par le bouton
- En ouvrant une vidéo dans un NOUVEL onglet ou en rafraichissant, l'extension doit être ouverture pour afficher la div#yousum 

------------------------------------------------------------------------------------------

Problème avec mon API sur PythonAnywhere : la connexion à youtube par yt-dlp ne fonctionne pas, j'obtiens l'erreur suivante en boucle 

	2025-02-24 21:30:41 --- Logging error ---
	2025-02-24 21:30:41 Traceback (most recent call last):
	2025-02-24 21:30:41   File "/usr/lib/python3.8/logging/handlers.py", line 940, in emit#012    self.socket.sendto(msg, self.address)
	2025-02-24 21:30:41 OSError: [Errno 9] Bad file descriptor

D'après les post ci-dessous, les serveurs qu'utilisent PythonAnywhere sont hébergés par les datacenters d'Amazon Web Service aux US, or YouTube bloque l'accès depuis les IPs d'AWS.
- https://www.pythonanywhere.com/forums/topic/29029/
- https://github.com/yt-dlp/yt-dlp/issues/11357

La solution est donc d'utiliser un proxy afin d'accéder à YouTube avec une IP différente qui ne sera pas bloquée.

------------------------------------------------------------------------------------------





DOCUMENTATION PYTHON
-------------------------------------------------

Structure des données extraites d'un commentaire avec YoutubeDL 

 {
'id': 'UgxQNe2xglsHV1gE_-N4AaABAg', 
'parent': 'root', 
'text': "J'aimerais 😢vraiment participer à cette conférence", 
'like_count': 0, 
'author_id': 'UCj8oObQMOXY9mhUEuQNN1jw', 
'author': '@darillesmith306', 
'author_thumbnail': 'https://yt3.ggpht.com/TH7S0v9XhJsTw_ZWkYO5rWlBuELDKEITzzO_TBuua3GhjcvWIwHTq7asVd0lsiK8vsmKbAMMTcg=s88-c-k-c0x00ffffff-no-rj', 
'author_is_uploader': False, 
'author_is_verified': False, 
'author_url': 'https://www.youtube.com/@darillesmith306', 
'is_favorited': False, 
'_time_text': '7 months ago', 
'timestamp': 1718496000, 
'is_pinned': False}

---------------------------------------------

Pour les cookies :
- Utiliser l'extension EditThisCookie (V3) et exporter les cookies YouTube avec au format Netscape HTTP Cookie File
info : https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp
info : https://github.com/yt-dlp/yt-dlp/blob/c54ddfba0f7d68034339426223d75373c5fc86df/yt_dlp/YoutubeDL.py

-------------------------------------------

Pour les proxies :
info : https://stackoverflow.com/questions/46389519/how-to-embed-socks5-proxy-in-youtube-dls-python-code
info : https://pypi.org/project/yt-dlp/
info : https://search.brave.com/search?q=python+yt_dlp+proxy&source=web&summary=1&conversation=cf38365ed6a7611aee3940
liste de proxies : https://free-proxy-list.net/
tuto (rotation de proxies): https://www.youtube.com/watch?v=FbtCl9jJyyc

