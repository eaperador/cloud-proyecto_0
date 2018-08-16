const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Evento = require('../models/eventos');

router.get('/users', (req, res) => {
    User.find({}, (err, user) => {
        res.json(user)
    });
});

router.get('/eventos/:usuario', (req, res) => {
    let usuario = req.params.usuario;
    if(usuario && (typeof usuario === 'string')) {
        Evento.find({'usuario' : usuario}, (err, evento) => {
            res.json(evento || []);
        });
    }
});

router.post('/eventos/:usuario', (req, res) => {
    let usuario = req.params.usuario;
    let body = req.body;
    if(usuario && (typeof usuario === 'string')) {
        Evento.create(body, (err, evento) => {
            if (err) {
                res.json(err)
                return;
            }
            res.json(evento);
        });
    }
});

router.delete('/eventos/:id', (req, res) => {
    let id = req.params.id;
    Evento.deleteOne({'_id': id}, (err, data) => { 
        if (err) {
            res.json(err)
        } else {
            res.json({
                deleted: true
            });
        }
    });
});

router.put('/eventos/:id', (req, res) => {
    let id = req.params.id;
    Evento.update({'_id': id}, req.body, (err, event) => {
        if (err) {
            res.json(err)
        } else {
            res.json({
                updated: true,
                event: event
            });
        }
    });
});

router.get('/users/:name', (req, res) => {
    let name = req.params.name;
    if(name && (typeof name === 'string')) {
        User.findOne({'usuario' : name}, (err, user) => {
            res.json(user || {});
        });
    }
});

router.post('/users', (req, res) => {
    let user = req.body;

    User.create(user, (err, user) => {
        if (err) {
            res.json(err)
            return;
        }
        res.json(user);
    });
});

router.post('/login', (req, res) => {
    let usuario = req.body;
    let name = usuario.usuario;
    let passwd = usuario.password;

    if(name && (typeof name === 'string') && passwd) {
        User.findOne({'usuario' : name}, (err, user) => {
            if(user && user.password === passwd) {
                delete user.password;
                res.json({
                    login: true,
                    user: user
                });
            } else {
                res.json({
                    login: false
                });
            }
        });
    } else {
        res.json({
            login: false,
            datos: usuario
        });
    } 
});

module.exports = router;