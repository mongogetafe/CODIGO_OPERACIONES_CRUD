// Operaciones de actualización

// Método update()

// db.<coleccion>.update(
//   <documento-consulta>, // Utiliza la misma sintaxis que para los find
//   <documento-actualización>, // Detallan los cambios a actualizar
//    {
//      multi: boolean // define si se actualizan todos los dosc o solo el primer doc que cumplan la consulta
//      ...
//    }
// )

// Set de datos

use biblioteca

db.libros.insert([
    {title: 'Cien Años de Soledad', autor: 'Gabriel García Márquez', stock: 10},
    {title: 'La Ciudad y Los Perros', autor: 'Mario Vargas Llosa', stock: 10, prestados: 2},
    {title: 'El Otoño del Patriarca', autor: 'Gabriel García Márquez', stock: 10, prestados: 0},
])

// Actualización de documento completo (sin el _id puesto que es inmutable)

db.libros.update(
    {title: 'Cien Años de Soledad'},
    {title: 'Cien Años de Soledad', autor: 'Gabriel García Márquez', stock: 10, prestados: 0}
)

// Opción upsert (update and insert) Crear un documento con la actualización si la consulta no devuelve
// ninguna coincidencia

db.libros.update(
    {title: 'El Coronel no tiene quien le escriba'},
    {title: 'El Coronel no tiene quien le escriba', autor: 'Gabriel García Márquez', stock: 5},
    {upsert: true}  // En este caso la operación es idempotente (el resultado será siempre el mismo a partir de la primera ejecución)
)

// Operaciones de actualización con operadores (las más habituales puesto que solo modifican algunos
// del o los documentos a actualizar)

// $set 
// {$set: {<campo>: <valor>, ...}}

db.libros.update({"_id" : ObjectId("5fbbf1944403d6bde7015251")}, {$set: {prestados: 2}})

// Si el campo a actualizar no existe, $set lo crea y le asigna el valor especificado

db.libros.update({"_id" : ObjectId("5fbbf1944403d6bde7015251")}, {$set: {prestados: 3, categorias: ['novela', 'castellano']}})


// Sobre campos en subdocumentos

db.libros.insert({
    titulo: 'El Quijote',
    autor: {
        nombre: 'Miguel',
        apellidos: 'Cervantes Saavedra',
        pais: 'España'
    }
})

db.libros.update({titulo: 'El Quijote'}, {$set: {"autor.apellidos": "De Cervantes Saavedra"}})

// Sobre elementos de un array

db.libros.update({"title" : "El Otoño del Patriarca"}, {$set: {"categorias.1": "español"}}) // acceso con notación
                                                                                            // del punto y posición del elemento

// $setOnInsert Establece el valor de uno o varios campos si la operación resulta una inserción
//              en caso de actualización el operador no hace nada

db.libros.update(
    {title: 'La Historia Interminable'},
    {$setOnInsert: {autor: 'Michael Ende'}, $set: {precio: 20}},
    {upsert: true}
)

// $unset Eliminar uno o varios campos (y sus valores)

// {$unset: {<campo>: '', ...}}  // Se le pasa string vacío como valor

db.libros.update(
    {title: 'La Historia Interminable'},
    {$unset: {precio: ''}} // Se pasa string vacío con indepencia del tipo de dato
)


// $currentDate

db.libros.update({titulo: 'El Quijote'}, {$set: {stock: 10}, $currentDate: {actualizadoEl: true}})

// Opción para tipo de dato timestamp

db.libros.update({titulo: 'El Quijote'}, {$set: {stock: 10}, $currentDate: {actualizadoEl: {$type: 'timestamp'}}})

// $inc 

// {$inc: {<campo>: cantidad, ...}}  Acepta valores positivos y negativos
// No se puede usar sobre campos con valor null

db.libros.update({"title" : "El Coronel no tiene quien le escriba"},{$inc: {stock: 5}}) // Sumará 5

// $min Solo actualiza si el valor a actualizar es menor que el actual

db.libros.update({"titulo" : "El Quijote"}, {$min: {stock: 12}}) // Si el stock actual es 10 no hará nada

db.libros.update({"titulo" : "El Quijote"}, {$min: {stock: 8}}) // Si el stock actual es 10 cambiará a 8 porque es menor

// Prueba con lexicográfico

db.libros.update({"titulo" : "El Quijote"}, {$set: {valoracion: 'b'}})

db.libros.update({"titulo" : "El Quijote"}, {$min: {valoracion: 'c'}}) // No haría nada

db.libros.update({"titulo" : "El Quijote"}, {$min: {valoracion: 'a'}}) // Modifica porque a es menor que b en lexicográfico (ASCII)

// $max contrario al anterior

// $mul

// {$mul: {<campo>: cantidad, ...}}
// Si no tiene el campo lo crea y le asigna el valor 0 (entiende que lo multiplicas por 0)
// Para campos con valor null error

db.libros.update({"title" : "El Coronel no tiene quien le escriba"},{$mul: {stock: 4}})

db.libros.update({"title" : "El Coronel no tiene quien le escriba"},{$mul: {prestados: 2}})

// $rename renombra los campos

// {$rename: {<campo>:<nuevo-nombre>, ...}}
// Si renombras a un nombre que ya existe en otro campo, borra ese campo

db.libros.update({titulo: "El Quijote"}, {$rename: {titulo: "title"}})

// Opción multi igual true para actualizar todas las coincidencias de la consulta

db.libros.update({}, {$set: {editorial: 'Planeta'}}) // Solo actualiza el primer documento encontrado por la consulta

db.libros.update({}, {$set: {editorial: 'Planeta'}}, {multi: true}) // Actualiza todos los docs encontrados por la consulta

db.libros.update({}, {$rename: {editorial: 'ed'}}, {multi: true}) 