"use strict"

var express = require("express");
var carritoController = require("../controllers/carrito.controller");
var api = express.Router();
var mdAuth = require("../middlewares/authenticated");

api.put("/agregarACarrito/:id",mdAuth.ensureUser,carritoController.agregarACarrito);

module.exports = api;