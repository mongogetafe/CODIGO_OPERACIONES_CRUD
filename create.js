// Operaciones de Inserción en MongoDB

// Método insert()
// Sintaxis

// db.<collection>.insert(
//    <documento ó array de documentos>,
//     {
//         writeConcern: <documento>, relativo a replica set
//         ordered: <true ó false>
//     }
// )

// Insertar un documento en coleccion sin _id

db.usuarios.insert({nombre: "Laura", apellidos: "López", edad: 30})
WriteResult({ "nInserted" : 1 })

// Insertar un documento en coleccion con _id

db.usuarios.insert({nombre: "Juan", apellidos: "Pérez", edad: 30, _id: 2})

// Insertar múltiples documentos

db.usuarios.insert([
    {_id: 4, nombre: "Carlos", apellidos: "López", edad: 45},
    {_id: 3, nombre: "María", apellidos: "Gómez", edad: 45}
])

// Insertar múltiples documentos con ordered true (valor por defecto)
// (Las inserciones múltiples no tienen roll-back si se produce error)

db.usuarios.insert([
    {_id: 10, nombre: "Carlos", apellidos: "López", edad: 45},
    {_id: 11, nombre: "María", apellidos: "Gómez", edad: 45},
    {_id: 11, nombre: "Carlos", apellidos: "López", edad: 45},
    {_id: 12, nombre: "María", apellidos: "Gómez", edad: 45},
    {_id: 13, nombre: "María", apellidos: "Gómez", edad: 45}
])

// Insertar múltiples documentos con ordered false

db.usuarios.insert([
    {_id: 20, nombre: "Carlos", apellidos: "López", edad: 45},
    {_id: 21, nombre: "María", apellidos: "Gómez", edad: 45},
    {_id: 21, nombre: "Carlos", apellidos: "López", edad: 45},
    {_id: 22, nombre: "María", apellidos: "Gómez", edad: 45},
    {_id: 23, nombre: "María", apellidos: "Gómez", edad: 45}
], {ordered: false})

// Ver de nuevo tipos de datos para _id (cualquiera menos array)

// Tipo de dato Date

db.usuarios.insert({nombre: "Juan", createdAt: new Date()})

// Los documentos pueden tener varios niveles de anidado con límite de 100

db.usuarios.insert(
    {
        nombre: 'Carlos',
        direcciones: [
            {
                calle: "Principe de Vergara", localidad: {
                    nombre: "Madrid",
                    cp: "28010"
                }
            },
            {
                calle: "Av Aviación", localidad: {
                    nombre: "Getafe",
                    cp: "28140"
                }
            }
        ]
    }
)

// Métodos alternativos insertOne() e insertMany()

// Sintaxis insertOne()

// db.<collection>.insertOne(
//    <documento>,
//     {
//         writeConcern: <documento>, relativo a replica set
//     }
// )

// Sintaxis

// db.<collection>.insertMany(
//    <array de documentos>,
//     {
//         writeConcern: <documento>, relativo a replica set
//         ordered: <true ó false>
//     }
// )

// Todo exactamente igual que insert() para cada caso uno o múltiples documentos
// excepto que insertOne() e insertMany() no soportan el método explain() para
// la comprobación de índices

// Método save() realiza tanto operaciones de inserción como de actualización
// *poco utilizado

// Sintaxis

// db.<collection>.save(
//    <documento>,
//     {
//         writeConcern: <documento>, relativo a replica set
//     }
// )

// si el documento pasado tiene un _id que no existe crea el documento y
// si el _id ya existe en la colección lo sustituye

db.usuarios.save( {_id: 30, nombre: "María", apellidos: "Gómez", edad: 45} )

db.usuarios.save( {_id: 4, nombre: "Luis", apellidos: "Gómez", edad: 45} )

// Métodos adicionales para insertar (su proposito original no es la inserción)

// db.<colección>.update()
// db.<colección>.updateOne()
// db.<colección>.updateMany()
// db.<colección>.findAndModify()
// db.<colección>.findOneAndUpdate()
// db.<colección>.findOneAndReplace()

// db.<colección>.bulkWrite()