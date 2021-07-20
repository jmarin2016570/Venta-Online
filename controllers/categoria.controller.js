"use strict"

var Categoria = require("../models/categoria.model");

function deafultCategoria(){
    var nombre = "Default"
    Categoria.findOne({name: nombre},(err,categoryFind)=>{
        if(err){
            console.log("Error al buscar",err);
        }else if(categoryFind){
            console.log("Categoría default ya existente");
        }else{
            var category = new Category();
            category.name = "Default";
            category.save((err,categorySaved)=>{
                if(err){
                    console.log("Error al intentar agregar");
                }else if(categorySaved){
                    console.log("Categoría default creada");
                }else{
                    console.log("No se creó la categoría Default");
                }
            })
        }
    })
}

function createCategoria(req,res){
    var params = req.body;
    
    if(params.name){
        Categoria.findOne({name: params.name},(err,categoryFind)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar"});
            }else if(categoryFind){
                return res.send({message: "Categoría ya existente"});
            }else{
                var category = new Category();
                category.name = params.name;
                category.save((err,categorySaved)=>{
                    if(err){
                        return res.status(500).send({message: "Error al intentar agregar"});
                    }else if(categorySaved){
                        return res.send({message: "Categoría creada exitosamente",categorySaved});
                    }else{
                        return res.status(404).send({message: "No se guardó"});
                    }
                })
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese los datos mínimos (Nombre)"})
    }
}

function updateCategoria(req,res){
    let categoryId = req.params.id;
    let update = req.body;

    if(update.name){
        Categoria.findOne({name: update.name},(err,categoryFind)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar"});
            }else if(categoryFind){
                return res.send({message: "Nombre de categoría ya existente"});
            }else{
                Categoria.findByIdAndUpdate(categoryId,update,{new:true},(err,categoryUpdated)=>{
                    if(err){
                        return res.status(500).send({message: "Error al actualizar"});
                    }else if(categoryUpdated){
                        return res.send({message: "Categoría actualizada exitosamente",categoryUpdated});
                    }else{
                        return res.status(500).send({message: "No se actualizó"});
                    }
                })
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese el nuevo nombre de categoría"});
    }
}

function removeCategoria(req,res){
    let categoryId = req.params.id;

    Categoria.findOne({_id : categoryId},(err,categoryFind)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar"});
        }else if(categoryFind){
            var productos = categoryFind.products;
            Categoria.findOneAndUpdate({name: "Default"},{$push:{products:productos}},{new: true},(err,categoryUpdated)=>{
                if(err){
                    return res.status(500).send({message: "Error al actualizar"});
                }else if(categoryUpdated){
                    Categoria.findOne({_id : categoryId},(err,categoryFind)=>{
                        if(err){
                            return res.status(500).send({message: "Error al buscar"});
                        }else if(categoryFind){
                            Categoria.findByIdAndRemove(categoryId,(err,categoryRemoved)=>{
                                if(err){
                                    return res.status(500).send({message: "Error al eliminar"});
                                }else if(categoryRemoved){
                                    return res.send({message: "Categoría eliminada exitosamente"});
                                }else{
                                    return res.status(404).send({message: "No se eliminó"});
                                }
                            })
                        }else{
                            return res.status(403).send({message: "ID de categoría inexistente o ya fue eliminada"});
                        }
                    })
                }else{
                    return res.status(404).send({message: "No se actualizó"});
                }
            })
        }else{
            return res.status(403).send({message: "ID de categoría inexistente o ya fue eliminada"});
        }
    })
}

function getCategorias(req,res){
    Categoria.find({}).populate("products").exec((err,categories)=>{
        if(err){
            return res.status(500).send({message: "Error al obtener los datos"});
        }else if(categories){
            return res.send({message: "Categorías:",categories});
        }else{
            return res.status(403).send({message: "No hay datos"});
        }
    })
}

function searchCategoria(req,res){
    var params = req.body;

    if(params.search){
        Categoria.find({name: params.search},(err,categoryFind)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar"});
            }else if(categoryFind){
                if(categoryFind != ""){
                    return res.send({message: "Coinciencias encontradas: ",categoryFind});
                }else{
                    return res.status(404).send({message: "No se encontraron coincidencias"});
                }
            }else{
                return res.status(404).send({message: "No se encontraron coincidencias"});
            }
        })
    }else if(params.search == ""){
        Categoria.find({}).exec((err,categories)=>{
            if(err){
                return res.status(500).send({message: "Error al obtener los datos"});
            }else if(categories){
                return res.send({message: "Categorías:",categories});
            }else{
                return res.status(403).send({message: "No hay datos"});
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese el dato de búsqueda (search)"});
    }
}

module.exports = {
    deafultCategoria,
    createCategoria,
    updateCategoria,
    removeCategoria,
    getCategorias,
    searchCategoria
}