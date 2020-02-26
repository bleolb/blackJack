const mongoose = require('mongoose');
const Sala = require('../models/salaModel');
const routerApi = express.Router();
const db = mongoose.connect('mongodb://localhost/Cine');

routerApi.route('/getSala')
    .get((req, res) => {
        Sala.find((err, resp) => {
            if (err) {
                return res.send(err)
            } else {
                return res.json(resp)
            }
        })
    })

routerApi.route('/newSala')
    .post((req, res) => {
        let sala = new Sala(req.body)

        sala.save((err, resp) => {
            if (err) {
                return res.json(err);
            }
            return res.json(resp);
        })
    });

routerApi.route('/updateSala')
    .put((req, res) => {

        let id = req.body.id
        let Query = req.body

        Sala.updateOne({ '_id': id }, Query, (err, resp) => {
            if (err) {
                return res.json(err);
            }

            return res.json(resp);
        })
    });

routerApi.route('/deleteSala')
    .delete((req, res) => {
        let id = req.body.id

        Sala.deleteOne({ '_id': id }, (err, resp) => {
            if (err) {
                return res.json(err);
            }
            return res.json(resp);
        })
    });

module.exports = routerApi;