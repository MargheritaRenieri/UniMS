# UniMS
PROGETTO PROGRAMMAZIONE WEB
1.	come utente voglio poter accedere ad un’area privata tramite username e password
2.	come admin voglio poter modificare il piano di studio
3.	come studente voglio potermi iscrivere ad un esame
4.	come professore voglio poter caricare ed inviare i risultati degli esami agli studenti
5.	come studente voglio visualizzare la mia carriera universitaria anche con l’ausilio di grafici


L'app viene deployata automaticamente al link:  https://unims.herokuapp.com/


ESAME			(matricolaP, matricolaS, idCorso, data, esito)
PROFESSORI		(matricolaP, codScuola, codCorso, Nome, Cognome, mail, mailUniversitaria, telefono, )
STUDENTI		(matricolaS, codCorso, idFacolta, Nome, Cognome, mail, mailUniversitaria, telefono, )
AMMINISTRATORI	(matrcicolaA, codScuola, nome, cognome, mail, mailUniversitaria, telefono)
FACOLTA		    (idFacolta, codScuola, codCorsi,nome)
SCUOLE			(idScuola, nome)
CORSI			(idCorso, codMatricolaS, codFacolta, codScuola)


--------- LINK UTILI ---------
https://www.pensando.it/wp/tutorial/anatomia-di-una-node-js-webapp-realizzata-con-mongodb-node-js-e-backbone-js

http://www.massimobiagioli.it/blog/servizi-rest-con-nodejs-express-mongoose-mongodb/

http://jorgeramon.me/2014/using-mongodb-and-mongoose-for-user-registration-login-and-logout-in-a-mobile-application/

https://github.com/claudiopastorini/Libretto-Delphi.git       5* grafici
http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/

