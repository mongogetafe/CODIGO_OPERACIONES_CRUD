// Operaciones bulkWrite permite realizar varias operaciones de escritura con control del orden de ejecución
// ¿Son esto transacciones? No.

// db.<coleccion>.bulkWrite(
//    [<operacion1>,<operacion2>, ...],
//    {
//        ordered: true | false,
//        writeConcern: <valor> // recocimiento de escritura para replica set   
//    }
// )

db.libros.bulkWrite([
    {
        insertOne: {
            document: {titulo: "El Señor de los Anillos", autor: "J.R.R. Tolkien"}
        }
    },
    {
        updateOne: {
            filter: {titulo: "La Historia Interminable"},
            update: {$set: {precio: 22}}
        }
    },
    {
        deleteOne: {
            filter: {autor: "William Shakespeare"}
        }
    }
])

// Docs sobre operaciones en https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/