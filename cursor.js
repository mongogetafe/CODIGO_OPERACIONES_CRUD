// Métodos para iterar cursor (donde son devueltos los docs de las consultas)

// hasNext() devuelve boolean true mientras existan documentos en el cursor

// next() leer el siguiente documento del cursor

// print()

// tojson() parsear a json

// toArray() convertir la salida del cursor en un array

// Para utilizar en la shell de mongo (conjuntamente con JavaScript)

while(clientes.hasNext()) { 
    print(tojson(clientes.next())) 
}

let clientes3 = db.clientes.find()
let arrayClientes = clientes3.toArray()
arrayClientes[8] // Devolvería algo similar a:
// {
//         "_id" : ObjectId("5fb6c23edf1464e2d070ae9e"),
//         "nombre" : "Laura",
//         "apellidos" : "Gómez",
//         "edad" : 20
// }

// Método count()
// db.<colección>.find(<consulta>).count() // Devuelve entero con el número de documentos devueltos por la consulta

use gimnasio

db.clientes.find({nombre: "Carlos"}).count()

// Método limit()
// db.<colección>.find(<consulta>).limit(<entero>) // Limita el cursor al entero específicado

db.clientes.find().limit(5)

// Método skip()
// db.<colección>.find(<consulta>).skip(<entero>)  // omite los documentos específicados en el entero

db.clientes.find().skip(5)

db.clientes.find().skip(0).limit(10) 
db.clientes.find().skip(10).limit(10) 
db.clientes.find().skip(20).limit(10) 
...

// Método sort()

// db.<coleccion>.find(<consulta>).sort(<documento>)

{ campo1: 1 | -1, campo2: 1 | -1, ...}

db.clientes.find({},{apellidos: 1, _id: 0}).sort({apellidos: -1}) // Un solo campo

db.clientes.find({},{apellidos: 1, _id: 0}).sort({apellidos: -1, nombre: 1}) // Varios campos

// Método distinct

// db.<coleccion>.distinct(<campo>,<consulta>,<opciones>) // Opción es colación

db.clientes.distinct("apellidos") // Devolver todos los valores distintos de apellidos