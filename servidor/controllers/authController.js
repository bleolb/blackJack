const express = require('express');
const Fabrica = require('../models/FabricaModel');
const routerApi = express.Router();


routerApi.route('/crear')
  .get((req, res) => {
    let construir = new Fabrica();
    
    res.json(construir.crear())
  });

routerApi.route('/mezclar')
  .get((req, res) => {
    let construir = new Fabrica();
    
    res.json(construir.mezclar())
  });


module.exports = routerApi;

