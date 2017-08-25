var express = require('express');
var router = express.Router();
var passport = require('passport');
var CorsiController = require('../controllers/corsiController');
var DocentiController = require('../controllers/docentiController');
var AppelliController = require('../controllers/appelliController');

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log('User non autenticato');
    res.redirect('/');
}

var studentiIscritti = new Array();

/** GET prof page. funzione impl nel controller*/
router.get('/', isAuthenticated, function (req, res) {
    CorsiController.cercaCorsiDocente(req.user.matricola, function (err, corsi) {
        AppelliController.listaAppelli(req.user.matricola, function (err, listaAppelli) {
            if (err) throw err;
            res.render('paginaDocente', {
                title: 'PaginaDocente',
                user: req.user,
                corsi: corsi,
                listaAppelli: listaAppelli
            });
        })
    })
});

router.get('/appello', isAuthenticated, function (req, res) {
    res.render('paginaDocenteAppello', {
        title: 'Gestione Appelli',
        studentiIscritti: studentiIscritti
    });
})

router.post('/nuovoAppello', isAuthenticated, function (req, res) {
    var infoAppello = {
        matricolaP: req.user.matricola,
        idCorso: req.body.idCorso,
        data: req.body.data,
        ora: req.body.ora,
        aula: req.body.aula
    };
    AppelliController.addAppello(infoAppello, function (err) {
        if (err) throw err;
    });
    res.redirect('/paginaDocente');
})


router.post('/aggiornaAppello', isAuthenticated, function (req, res) {
    var modificaAppello = {
        data: req.body.data,
        ora: req.body.ora,
        aula: req.body.aula
    };
    AppelliController.updateAppelli(req.body._id, modificaAppello, function (err) {
        if (err) throw err;
    });
    res.redirect('/paginaDocente');
})

router.post('/eliminaAppello', isAuthenticated, function (req, res) {
    AppelliController.removeAppelli(req.body._id, function (err) {
        if (err) throw err;
    });
    res.redirect('/paginaDocente');
})

router.post('/appello', isAuthenticated, function (req, res) {
    AppelliController.findAppello(req.body.gestisciAppelli, function(err, appello){
        appello.matricolaS.forEach(function(studente) {
            studentiIscritti.push(studente);
        });
        appello.save();
    })
    res.redirect('/paginaDocente/appello');
})


module.exports = router;