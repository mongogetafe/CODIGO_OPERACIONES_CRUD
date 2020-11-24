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

// Renombrado de campos en docs embebidos

db.libros.insert({
    title:"Mas Ruido que Nueces", 
    autor: "William Shakespeare", 
    categoria: {
        primaria: "novela",
        lengua: "inglés"
    }
})

db.libros.update({ title:"Mas Ruido que Nueces"}, {$rename: {"categoria.lengua": 'categoria.idioma'}}) 

db.libros.update(
    { title:"Mas Ruido que Nueces"},
    {$set: {
        editoriales: [
            {nombre: "Planeta", isbn: "vdfhkvjhdfkjhv"},
            {nombre: "Deusto", isbn: "cssjdjscgjshgd"}
        ]
    }}
)

db.libros.update({ title:"Mas Ruido que Nueces"}, {$rename: {"editoriales.isbn": 'editoriales.codIsbn'}}) // Error
// WriteResult({
//     "nMatched" : 0,
//     "nUpserted" : 0,
//     "nModified" : 0,
//     "writeError" : {
//             "code" : 28,
//             "errmsg" : "cannot use the part (editoriales of editoriales.isbn) to traverse the element ({editoriales: [ { nombre: \"Planeta\", isbn: \"vdfhkvjhdfkjhv\" }, { nombre: \"Deusto\", isbn: \"cssjdjscgjshgd\" } ]})"
//     }
// })

db.libros.update({ title:"Mas Ruido que Nueces"}, {$rename: {"editoriales.0.isbn": 'editoriales.0.codIsbn'}}) // También error

// luego el renombrado de campos de documentos embebidos se puede realizar con la notación del punto
// pero no es posible en renombrado de campos de documentos embebidos dentro de un array

// Operadores de actualización para arrays

// $ (operador posicional) para actualizacion

// { "<array>.$": valor }

db.libros.update( // para set de datos
    { title:"Mas Ruido que Nueces"},
    {$set: {categorias: ["inglesa","medieval","novela"]}}
)

db.libros.update({categorias: "novela"},{$set: {"categorias.$": "Novela"}},{multi: true})

// Otro ejemplo

db.libros.insert([
    { titulo:"Mas Ruido que Nueces", autor: "William Shakespeare", valoraciones: ["bien","regular","bien","mal","muy bien"]},
    { titulo:"La Historia Interminable", autor: "Michael Ende", valoraciones: ["muy bien","regular","bien","bien","muy bien"]},
])

db.libros.update({valoraciones: "bien"}, {$set: {"valoraciones.$": "correcto"}}, {multi: true}) // Solamente cambia la
                                                                                        // primera coincidencia

// $[] (operador posicional) idem anterior pero cambia todos los elementos del array
// en los documentos de la consulta

// { "<array>.$[]": valor }

db.libros.insert({titulo: "The Firm", autor:"John Grisham", opiniones: [3,2,5,4,6]})

db.libros.update({titulo: "The Firm"}, {$set: {"opiniones.$[]": 7}})

// $[<identificador>] (operador posicional) idem anterior pero permite especificar qué elementos serán
// modificados de los docs de la consulta

// { "<array>.$[<identificador>]": valor }
// {arrayFilters:[{<identificador>: <condicion>}]}

db.libros.update(
    {titulo: "The Firm"},
    {$set: {precios: [22,21,13,18,21,14]}}
)

db.libros.update (
    {titulo: "The Firm"},
    {$set: {"precios.$[elem]": 15}},
    {arrayFilters: [{"elem": {$lt: 15}}]}
)

// Otro ejemplo más... estos operadores se pueden usar con otros operadores de campo que no sean $set 
// Con $inc

"precios" : [
    22,
    21,
    15,
    18,
    21,
    15
]

db.libros.update(
    {titulo: "The Firm"},
    {$inc: {"precios.$[]": 2}}
)

a) [22, 21, 15, 18, 21, 15]

b) [24, 23, 17, 20, 23, 17] // correcta

c) [2, 2, 2, 2, 2, 2]

d) [24, 21, 15, 18, 21, 15]

// $addToSet Añade un valor a un campo array salvo que el valor ya exista y en ese caso no hace nada
// {$addToSet: {<array>: valor}}


db.libros.update({},{$set: {categorias: ['novela']}},{multi: true})

db.libros.update({}, {$addToSet: {categorias: "castellano"}},{multi: true})  // Operación idempotente

// $each

db.libros.update({"titulo" : "The Firm"},{$addToSet: {categorias: ["USA","drama"]}}) // categorias ["novela", "castellano",["USA","drama"]]

db.libros.update({"titulo" : "The Firm"},{$addToSet: {categorias: {$each: ["USA","drama"]}}}) 

// $pop
// {$pop: {<array>: -1 | 1}} // para -1 elimina el primer elemento y para 1 el último elemento del array

db.libros.update({"titulo" : "The Firm"},{$pop: {categorias: -1}}) // En este caso elimina el primero

// $pull elimina los elementos que cumplan la condición especificada
// {$pull: {<array>: valor|condicion}}

db.libros.update({"titulo" : "The Firm"},{$pull: {categorias: "USA"}})

db.libros.update({"titulo" : "The Firm"},{$set: {categorias: ["castellano", "USA", "drama","novela","castellano"]}}) // Reponemos array

// Ejemplo con expresión

db.libros.update({"titulo" : "The Firm"},{$pull: {categorias: {$in: ["castellano","drama"]}}}) // Funciona como un $pullAll

// Ejemplo con expresión regular para eliminar todos All credits to Juan Carlos

db.libros.update({"titulo" : "The Firm"},{$pull: {categorias: /./}})

// $pullAll idem con una lista de elementos a eliminar
// {$pullAll: {<array>: [valor1, valor2, ...]}}

db.libros.update({"titulo" : "The Firm"},{$pullAll: {categorias: ["castellano","drama"]}}) 

// $push y modificadores 
// {$push: {<array>: {<modificadores: valor, ...}}}

// Básico añadir un elemento al final del array

db.libros.insert({titulo: "El Caso Fitgerald", autor: "John Grisham", categorias: ["novela","drama"]})

db.libros.update({titulo: "El Caso Fitgerald"}, {$push: {categorias: "USA"}}) // Añade el elemento

// Añadir varios elementos al final del array

db.libros.update({titulo: "El Caso Fitgerald"}, {$push: {categorias: {$each: ["suspense","inglés"]}}}) // Añade cada elemento

// Añadir elementos con modificadores del array

db.libros.update({titulo: "El Caso Fitgerald"}, {$push: {categorias: {$each:["best-seller","leyes"], $sort: -1, $slice: -3}}})

// Añadir elementos con el modificador de posición

db.libros.update({titulo: "El Caso Fitgerald"}, {$push: {categorias: {$each:["tapa dura","america"], $position: 1 }}}) // añade desde
                                                                                                            // el índice de la posición