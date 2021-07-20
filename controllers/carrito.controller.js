"use strict"

var Carrito = require("../models/carrito.model");
var Producto = require("../models/producto.model");

function agregarACarrito(req,res){
    var productoId = req.params.id;
    var params = req.body;
    var userId = req.user.sub;

    if(params.stock){
        Producto.findById(productoId,(err,productoFind)=>{
            if(err){
                return res.status(500).send({message: "Error al agregar un producto al carrito"});
            }else if(productoFind){
                if(params.stock > productoFind.stock){
                    return res.status(403).send({message: "La cantidad a llevar es mayor a la cantidad del producto"});
                }else{
                    Carrito.findOneAndUpdate({owner: userId},{$push:{products:productoFind._id,stock:params.stock}},{new:true},(err,carritoUpdated)=>{
                        if(err){
                            return res.status(500).send({message: "Error al agregar producto al carrito"});
                        }else if(carritoUpdated){
                            return res.send({message: "Producto agregado al carrito exitosamente"});
                        }else{
                            return res.status(404).send({message: "No se agregó al carrito (No se encontró su carrito)"});
                        }
                    })
                }
            }else{
                return res.status(403).send({message: "Producto inexistente"});
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese la cantidad de productos a llevar"});
    }
}

module.exports = {
    agregarACarrito
}