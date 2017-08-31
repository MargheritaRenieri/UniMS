var Docenti = require('../models/personale').model('Prof');
var Appelli = require('../models/esame');
var Carriera = require('../models/appelliVerbalizzati');
var Studente = require('../models/user');
var Corsi = require('../models/corsi');

var AppelliController = function () { };

AppelliController.addAppello = function (data, callback) {
    var newAppello = new Appelli();

    newAppello.idCorso = data.idCorso;
    newAppello.data = data.data;
    newAppello.ora = data.ora;
    newAppello.aula = data.aula;
    newAppello.matricolaP = data.matricolaP;

    newAppello.save(function (err) {
        if (err) throw err;
        console.log('Appello salvato con successo!');
    });
}

AppelliController.updateAppelli = function (id, data, callback) {
    Appelli.findOneAndUpdate({ '_id': id },
        {
            'data': data.data,
            'ora': data.ora,
            'aula': data.aula
        }, function (err) {
            if (err) throw err;
            console.log('Dati aggiornati con successo!');
        });
}

AppelliController.removeAppelli = function (id, callback) {
    Appelli.findOneAndRemove({ '_id': id }, function (err) {
        if (err) throw err;
        console.log('Appello rimosso con successo!');
    });
}

AppelliController.verbalizzaAppello = function (data, matricolaS, idAppello, callback) {
    var newCarriera = new Carriera();

    newCarriera.codCorso = data.codCorso;
    newCarriera.data = data.data;
    newCarriera.esito = data.esito;
    Corsi.findOne({ 'codice': data.codCorso }, function (err, corso) {
        newCarriera.cfu = corso.cfu;

        newCarriera.save(function (err) {
            if (err) throw err;
            console.log('Verbalizzazione avvenuta con successo!');
        });

        Studente.findOne({ 'matricola': matricolaS }, function (err, studente) {
            studente.carriera.push(newCarriera);
            studente.save();

      /*      Appelli.findOne({ '_id': idAppello }, function (err, appello) {
                if (err) throw err;
                var i = appello.matricolaS.indexOf(matricolaS);
                if (i > -1) {
                    appello.matricolaS.splice(i, 1);
                    appello.esito.splice(i, 1);
                }
                appello.save();
            });*/
        });
    });
}

AppelliController.calcolaProgressione = function (matricolaS, callback) {
    Studente.findOne({ 'matricola': matricolaS }, function (err, studente) {
        if (err) return callback(err, null);
        else {
            var progressioneCfu = 0;
            studente.carriera.forEach(function (element) {
                progressioneCfu += element.cfu;
            });
            return callback(null, progressioneCfu);
        }
    });
}

AppelliController.listaAppelli = function (docente, callback) {
    Appelli.find({ 'matricolaP': docente }, function (err, listaAppelli) {
        if (err) return callback(err, null);
        else
            return callback(null, listaAppelli);
    }).sort('idCorso').sort('data');
}

AppelliController.listaAppelliPerCorso = function (idCorso, callback) {
    Appelli.find({ 'idCorso': idCorso }, function (err, listaAppelliPerCorso) {
        if (err) return callback(err, null);
        else
            return callback(null, listaAppelliPerCorso);
    }).sort('data');
}

AppelliController.prenotazione = function (matricolaStudente, id) {
    Appelli.findOne({ '_id': id }, function (err, appello) {
        if (err) throw err;
        appello.matricolaS.push(matricolaStudente);
        appello.save();
    });
    console.log('Prenotazione avvenuta con successo');
}

AppelliController.cancellaPrenotazione = function (matricolaStudente, id) {
    Appelli.findOne({ '_id': id }, function (err, appello) {
        if (err) throw err;
        var arr = [];
        var i = appello.matricolaS.indexOf(matricolaStudente);
        if (i > -1)
            appello.matricolaS.splice(i, 1);
        appello.save();
    });
    console.log('Prenotazione cancellata con successo');
}

AppelliController.addEsito = function (listEsiti, id) {
    Appelli.findOne({ '_id': id }, function (err, appello) {
        if (err) throw err;
        listEsiti.forEach(function (thisEsito) {
            appello.esito.push(thisEsito);
        });
        appello.save(); //! save() è asincrono. Per salvare i dati nell'ordine esatto in cui vengono inseriti, prima vengono pushati in un array
    });
}

AppelliController.arrayEsiti = function (array, esito, callback) {
    Appelli.find(function (err) {
        if (err) return callback(err, null);
        else {
            array.push(esito);
            return callback(null, array);
        }
    });
}

AppelliController.seeEsiti = function (id, callback) {
    Appelli.findOne({ '_id': id }, function (err, appello) {
        if (err) return callback(err, null);
        var matriceVoti = [];
        var votoPersonale = [];
        for (var i = 0; i < appello.esito.length; i++) {
            votoPersonale = [appello.matricolaS[i], appello.esito[i]];
            matriceVoti.push(votoPersonale);
        }
        return callback(null, matriceVoti);
    });
}

AppelliController.checkStudente = function (matricolaStudente, id, callback) {
    Appelli.findOne({ '_id': id }, function (err, appello) {
        if (err) return callback(err, null);
        var bool = appello.matricolaS.find(o => o === matricolaStudente);
        if (typeof bool === 'undefined')
            return callback(null, false);
        else callback(null, true);
    });
}

AppelliController.findAppello = function (idCorso, callback) {
    Appelli.findOne({ '_id': idCorso }, function (err, appello) {
        if (err)
            return callback(err, null);
        else
            return callback(null, appello);
    })
}

AppelliController.listaPerStudente = function (matricolaS, callback) {
    Appelli.find({ 'matricolaS': matricolaS }, function (err, appelliPrenotati) {
        if (err) return callback(err, null);
        else
            return callback(null, appelliPrenotati);
    });
}

AppelliController.sendEsitoStudente = function (matricolaS, idAppello, callback) {
    Appelli.findOne({ '_id': idAppello }, function (err, appello) {
        if (err) return callback(err, null, null, null);
        else {
            var i = 0;
            appello.matricolaS.forEach(function (element) {
                if (element === matricolaS) {
                    var myEsito = appello.esito[i];
                    return callback(null, myEsito, appello.data, appello.idCorso);
                }
                i++;
            });
        }
    });
}

module.exports = AppelliController;