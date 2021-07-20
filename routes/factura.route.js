"use strict"

var express = require("express");
var facturaController = require("../controllers/factura.controller");
var api = express.Router();
var mdAuth = require("../middlewares/authenticated");

api.put("/addFactura",mdAuth.ensureUser,facturaController.addFactura);
api.get("/getFacturas",mdAuth.ensureUser,facturaController.getFacturas);
api.get("/getProductosFactura/:id",[mdAuth.ensureUser,mdAuth.ensureAdmin],facturaController.getProductosFactura);
api.get("/getProductos",mdAuth.ensureUser,facturaController.getProductos);

module.exports = api;