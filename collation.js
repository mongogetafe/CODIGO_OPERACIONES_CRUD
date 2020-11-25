// Colación permite establecer criterios de comparación para strings según reglas locales (de cada lenguaje)

// La colación se especifica en tres niveles

// - a nivel de operaciones que utilicen consulta
// - a nivel de índice
// - a nivel de colección

// Las opciones de colación se establecen en un documento con una serie de propiedad/valor

// - a nivel de colección

use tienda

db.productosSinColacion.insert([
    {_id: 1, nombre: 'cafe'},
    {_id: 2, nombre: 'café'},
    {_id: 3, nombre: 'cafE'},
    {_id: 4, nombre: 'cafÉ'}
])

db.productosSinColacion.find({}).sort({nombre: 1})
{ "_id" : 3, "nombre" : "cafE" }
{ "_id" : 1, "nombre" : "cafe" }
{ "_id" : 4, "nombre" : "cafÉ" }
{ "_id" : 2, "nombre" : "café" }

db.createCollection("productosConColacion", { collation: {locale: "es"}})

db.productosConColacion.insert([
    {_id: 1, nombre: 'cafe'},
    {_id: 2, nombre: 'café'},
    {_id: 3, nombre: 'cafE'},
    {_id: 4, nombre: 'cafÉ'}
])

db.productosConColacion.find({}).sort({nombre: 1})
{ "_id" : 1, "nombre" : "cafe" }
{ "_id" : 3, "nombre" : "cafE" }
{ "_id" : 2, "nombre" : "café" }
{ "_id" : 4, "nombre" : "cafÉ" }

// Ejemplo con eñes Powered by Fernando

db.productosSinColacion.insert([
    {_id: 10, pais: "España"},
    {_id: 11, pais: "Espana"}
])

db.productosConColacion.insert([
    {_id: 10, pais: "España"},
    {_id: 11, pais: "Espana"}
])

// Para acceder a las opciones o info de una colección tenemos
// db.getCollectionInfos({name: <nombre-de-coleccion>})

// No se pueden modificar 'en caliente' las opciones de una colección

// Como utilizar colación a nivel de operacion

db.productosSinColacion.find({}).sort({nombre: 1}).collation({locale: "es"})

{ "_id" : 1, "nombre" : "cafe" }
{ "_id" : 3, "nombre" : "cafE" }
{ "_id" : 2, "nombre" : "café" }
{ "_id" : 4, "nombre" : "cafÉ" }

// Strength en colación (Controlar en las búsquedas sobre string si distingue o no minúsculas, mayúsculas y diacríticos)

// El valor de strength por defecto es 3, lo quiere decir que distingue mayus/minus/diacríticos

db.productosSinColacion.find({nombre: "cafe"}).collation({locale: "es"})

{ "_id" : 1, "nombre" : "cafe" } // solo devuelve la cumple mayus/minus/diacríticos

// Nivel 2 de strength () no distinguir mayúsculas de minúsculas

db.productosSinColacion.find({nombre: "cafe"}).collation({locale: "es", strength: 2})

{ "_id" : 1, "nombre" : "cafe" }
{ "_id" : 3, "nombre" : "cafE" }

// Nivel 1 de strength no distingue ni mayúsculas ni minúsculas ni diacríticos

db.productosSinColacion.find({nombre: "cafe"}).collation({locale: "es", strength: 1})
db.productosSinColacion.find({nombre: "café"}).collation({locale: "es", strength: 1})
db.productosSinColacion.find({nombre: "cafë"}).collation({locale: "es", strength: 1})
{ "_id" : 1, "nombre" : "cafe" }
{ "_id" : 2, "nombre" : "café" }
{ "_id" : 3, "nombre" : "cafE" }
{ "_id" : 4, "nombre" : "cafÉ" }

// caseLevel (boolean) define si distingue o no mayúsculas de minúsculas (para usar con strength 1)

db.productosSinColacion.find({nombre: "café"}).collation({locale: "es", strength: 1, caseLevel: true})
{ "_id" : 1, "nombre" : "cafe" }
{ "_id" : 2, "nombre" : "café" }

// caseFirst "upper" | "lower" para preferencia de mayúsc/minúsculas en orden de la consulta

db.productosSinColacion.find({}).collation({locale: "es"}).sort({nombre: 1})
{ "_id" : 10, "pais" : "España" }
{ "_id" : 11, "pais" : "Espana" }
{ "_id" : 1, "nombre" : "cafe" }  // Devolvía antes la mínuscula (por criterio locale: "es")
{ "_id" : 3, "nombre" : "cafE" }
{ "_id" : 2, "nombre" : "café" }
{ "_id" : 4, "nombre" : "cafÉ" }

db.productosSinColacion.find({}).collation({locale: "es", caseFirst: "upper"}).sort({nombre: 1})
{ "_id" : 10, "pais" : "España" }
{ "_id" : 11, "pais" : "Espana" }
{ "_id" : 3, "nombre" : "cafE" } // Devuelve primero la mayúscula al establecer "upper"
{ "_id" : 1, "nombre" : "cafe" }
{ "_id" : 4, "nombre" : "cafÉ" }
{ "_id" : 2, "nombre" : "café" }

db.productosSinColacion.find({}).collation({locale: "es", caseFirst: "upper"}).sort({nombre: 1})

// numericOrdering para ordenar de manera numérica campos de tipo string

db.productosSinColacion.insert([
    {_id: 20, codigo: 'A1'},
    {_id: 21, codigo: 'A2'},
    {_id: 22, codigo: 'A3'},
    {_id: 23, codigo: 'A11'},
    {_id: 24, codigo: 'A21'},
])

db.productosSinColacion.find({_id: {$gte: 20}}).collation({locale: "es"}).sort({codigo: 1})

{ "_id" : 20, "codigo" : "A1" }
{ "_id" : 23, "codigo" : "A11" }
{ "_id" : 21, "codigo" : "A2" }
{ "_id" : 24, "codigo" : "A21" }
{ "_id" : 22, "codigo" : "A3" }

db.productosSinColacion.find({_id: {$gte: 20}}).collation({locale: "es", numericOrdering: true}).sort({codigo: 1})

{ "_id" : 20, "codigo" : "A1" }
{ "_id" : 21, "codigo" : "A2" }
{ "_id" : 22, "codigo" : "A3" }
{ "_id" : 23, "codigo" : "A11" }
{ "_id" : 24, "codigo" : "A21" }

