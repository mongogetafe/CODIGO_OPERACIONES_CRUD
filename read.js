// Operaciones de Lectura en MongoDB

// Método find()

// Sintaxis
// db.<colección>.find(
//    <documento-de-consulta>,
//    <documento-de-proyección>   
// )

// Todos los documentos de la colección (en un cursor con 20 docs. max.)

// db.<colección>.find()
// db.<colección>.find({})


// Set de datos para insertar en una base de datos gimnasio

db.clientes.insert([
    {nombre: "Luisa", apellidos: "Pérez", dni: "07456189D"},
    {nombre: "José", apellidos: "Gómez", dni: "88794561D"},
    {nombre: "José", apellidos: "López", dni: "77894014D"}
])

// Especificación de condición de igualdad
// {<campo>:<valor>, ...}

db.clientes.find({nombre:"José"})

db.clientes.find({apellidos: "Gómez", nombre:"José" })

db.clientes.find({_id: "5fb6b5abdf1464e2d070ae97"}) // No encuentra esa cadena
db.clientes.find({_id: ObjectId("5fb6b5abdf1464e2d070ae97")}) // Si encuentra cuando pasamos
                                                              // como ObjectId()

// Especificación de condiciones usando operadores de consulta
// Sintaxis básica de operadores ($)
// { <campo>: {<operador1>: <valor>, ...} }

db.clientes.insert({nombre: "Lucía", apellidos: "Pérez", clases: ["aerobic","zumba"]})
db.clientes.insert({nombre: "Sergio", apellidos: "González", clases: ["padel","zumba"]})

db.clientes.find({clases: {$in: ["zumba","aerobic"]}})

// Especificación de condiciones AND
// 1ª forma que es con las condiciones de igualdad

db.clientes.find({apellidos: "Gómez", nombre:"José" }) // la coma funciona como AND lógico

db.clientes.insert([
    {nombre: "Luisa", apellidos: "Pérez", edad: 33},
    {nombre: "José", apellidos: "Gómez", edad: 17},
    {nombre: "José", apellidos: "López", edad: 22}
])

db.clientes.find({nombre: "José", edad: {$gt: 18}})

db.clientes.find({edad:{$gte: 18}, edad:{$lt: 30}})  // Ojo OR inclusivo si aparece
                                                    // el mismo campo varias veces
db.clientes.find({edad:{$gte: 18, $lt: 30}}) // All credits to Aroa

// 2ª Forma con el operador $and

db.clientes.find({$and: [{edad: {$gte: 18}}, {edad: {$lt: 30}}]}) 

// Especificación de condiciones OR
// Empleamos el operador $or : [ {documento}, {documento}, ...]

db.clientes.find({
    $or: [
        {nombre: "José"},
        {edad:{$gte: 20}}
    ]
})

db.clientes.find({
    $or: [
        {nombre: "José", apellidos: "Pérez"},
        {edad:{$gte: 20}}
    ]
})

// Combinar AND y OR

db.clientes.find({
    apellidos: "Gómez",
    $or: [
        {edad: {$gte: 18}},
        {nombre: "José"}
    ],
    clases: {$in: ["aerobic"]}
}) // Apellidos debe ser igual a Gómez y clases deben tener aerobic y, o la edad
   // es mayor o igual a 18 o el nombre es igual a José.

   // Coincidencias en documentos embebidos

   // set de datos

   db.clientes.insert([
        { 
           nombre:"Celia",
           apellidos: "Sánchez",
           domicilio: {
               calle: "Gran vía 80",
               cp: "28003",
               localidad: "Madrid"
           }
        },
        { 
           nombre:"Carlos",
           apellidos: "Pérez",
           domicilio: {
               calle: "Alcalá 200",
               cp: "28010",
               localidad: "Madrid"
           }
        },
        { 
           nombre:"Inés",
           apellidos: "Pérez",
           domicilio: {
               calle: "Burgos, 10",
               cp: "28900",
               localidad: "Alcorcón"
           }
        }
   ])

   db.clientes.find({domicilio: {calle: "Burgos, 10", cp: "28900", localidad: "Alcorcón"}})

   // Si el orden de los campos no es el mismo del documento anidado o embebido
   // no encuentra coincidencia porque lo busca es el valor del literal de objeto
   db.clientes.find({domicilio: {cp: "28900", calle: "Burgos, 10", localidad: "Alcorcón"}})

// Coincidencias en campos de documentos embebidos
// Acceso a campos con notación del punto "campo.campoDocumento" 
// Consulta de igualdad

db.clientes.find({"domicilio.localidad": "Madrid"})

db.clientes.find(
    {
    "domicilio.localidad": "Madrid", 
    "domicilio.cp": "28003"
    }
)

// Coincidencias en Arrays

// Coincidencias en valor completo del Array

db.clientes.find({clases: ["aerobic","zumba"]}) // Igualdad exacta del array

// Coincidencias en los elementos del Array (usando operadores)

// Operador $all El campo contenga al menos todos los elementos descritos en la consulta

db.clientes.insert(
    {
        nombre: "Juan José",
        apellidos: "Pérez",
        clases: ["padel","esgrima","pesas"]
    }
)

db.clientes.find({clases: {$all: ["esgrima","padel","pesas"]}})
db.clientes.find({clases: {$all: ["padel","pesas"]}})

// Consulta de valor de elemento en un array
// Si el valor o condición pasada se cumple en uno de los elementos del array
// se devuelve ese documento en la consulta

db.clientes.find({clases: "padel"})

db.clientes.insert([
    {nombre: "María", apellidos: "García", puntuaciones: [100,120,44]},
    {nombre: "Fernando", apellidos: "García", puntuaciones: [60,90,70]}
])

db.clientes.find({puntuaciones: {$lte: 50}}) // Al menos un elemento del array cumpla la condicion

// Consulta de múltiples condiciones en elementos de array

db.clientes.find({puntuaciones: {$gte: 50, $lt: 75}}) // Al menos un elemento del array o una combinación de varios
                                                      // elementos deben cumplir todas las condiciones

// Consulta de múltiples condiciones un solo elemento del array

db.clientes.find({puntuaciones: {$elemMatch: {$gte: 50, $lt: 75}}})  // Al menos un elemento del array debe cumplir
                                                                    // todas las condiciones

// Consultas por la posición de un elemento del array (Notación del punto con el índice del array)

db.clientes.find({"clases.0": "padel"}) // Buscará los que en la posición 0 del array tenga el valor (o expresión)

// Consulta de documentos con array con un determinado número de elementos

db.clientes.find({clases: {$size: 3}})

// Consultas de documentos en array

db.clientes.insert([
    {
        nombre: "Carlos",
        apellidos: "García",
        direcciones: [
            {calle: "Alcalá 40", cp: "28001", localidad: "Madrid"},
            {calle: "Zamora 13", cp: "34005", localidad: "Vigo"},
        ]
    },
    {
        nombre: "Susana",
        apellidos: "Gómez",
        direcciones: [
            {calle: "Alcalá 60", cp: "28001", localidad: "Madrid"},
            {calle: "Fuencarral 13", cp: "28002", localidad: "Madrid"},
        ]
    },
])

// Consulta de igualdad de campo de tipo array de documentos

db.clientes.find({direcciones: [ // El valor como ocurre con documentos y arrays de primitivos debe ser exactamente igual incluyendo orden
    {calle: "Alcalá 60", cp: "28001", localidad: "Madrid"},
    {calle: "Fuencarral 13", cp: "28002", localidad: "Madrid"},
]})

// Consulta en un campo de un subdocumento de un array de documentos (notación del punto)

db.clientes.find({"direcciones.localidad": "Madrid"})  // Devuelve los documentos en los que, al menos uno de sus subdocumentos
                                                      // del array direcciones contiene el campo localidad con el valor Madrid

// Consulta en un campo de un subdocumento en una determinada posición de un array de documentos (notación del punto)

db.clientes.find({"direcciones.1.localidad": "Madrid"}) // Devuelve los documentos en los que el segundo subdocumento
                                                        // del array direcciones contiene el campo localidad con el valor Madrid

// Especificar múltiples condiciones en arrays de documentos

db.monitores.insert([
    {
        nombre: "Pedro",
        apellidos: "López",
        actividades: [
            {clase: "aerobic", turno: "mañana", homologado: false},
            {clase: "aerobic", turno: "tarde", homologado: false},
            {clase: "zumba", turno: "mañana", homologado: true},
        ]
    },
    {
        nombre: "María",
        apellidos: "Pérez",
        actividades: [
            {clase: "aerobic", turno: "tarde", homologado: true},
            {clase: "zumba", turno: "tarde", homologado: false}
        ]
    },
])

// Varios subdocumentos del array pueden en combinación cumplir todas las condiciones

db.monitores.find({"actividades.clase": "aerobic", "actividades.homologado": true})

// Uno de los subdocumentos del array debe cumplir todas las condiciones

db.monitores.find({actividades: {$elemMatch:{clase: "aerobic", homologado: true}}})

// Proyección de documentos

// db.<colección>.find({consulta},{proyección})

// Devuelve todos los campos si no se introduce el documento de proyección

// Para devolver los campos especificados y el campo _id

db.clientes.find({edad: {$gte: 18}},{nombre: 1, apellidos: 1}) // devolverá de los documentos encontrados el campo nombre, apellidos y _id

db.clientes.find({}, {nombre: 1})  // devolverá todos los documentos con el campo nombre y _id

// Devolución sin el campo _id

db.clientes.find({},{_id: 0, nombre: 1, apellidos: 1})  // Con el valor 0 excluimos el campo _id

// Exclusión de campos en el doc de proyeccion

db.clientes.find({},{_id: 0, nombre: 0, apellidos: 0})  // Con el valor 0 excluimos todos los campos introducidos

// Combinación de inclusion y exclusión de campos: No se pueden incluir y excluir campos en el 
// mismo documento de proyección a excepción del campo _id

db.clientes.find({},{_id: 0, nombre: 1, apellidos: 0})  // Error

db.clientes.find({},{_id: 1, nombre: 0, apellidos: 0})  // Valido

// Campos específicos en subdocumentos

db.clientes.find({},{nombre: 1, "domicilio.calle": 1, _id: 0}) // Devolverá el campo nombre y el campo calle de
                                                               // los subdocumentos del campo domicilio (mantiene la estructura)

db.clientes.find({},{"domicilio.calle": 0, _id: 0})  // Excluye del documento del campo domicilio su campo calle

// Campos específicos en arrays de documentos

db.clientes.find({},{"direcciones.localidad": 1, _id: 0}) // Devolverá el campo localidad de cada documento del array direcciones

// Consultas para campos con valor null o campos inexistentes

db.monitores.insert({nombre: "Sergio", apellidos: "Pérez"})
db.monitores.insert({nombre: "Sara", apellidos: "González", actividades: null})

// Cuando pasamos en la consulta un valor de igualdad null devuelve los documentos con ese campo y valor null
// y también los documentos que no tengan ese campo

db.monitores.find({actividades: null})

// Si necesitamos estrictamente los que tiene valor null

db.monitores.find({actividades: {$type: 10}})  // 10 es el correspondiente a los tipos-valor null

// o bien

db.monitores.find({actividades: {$type: "null"}})  // Ref operador para ver los tipos https://docs.mongodb.com/manual/reference/operator/query/type/

// Consulta para comprobación de existencia de campos

db.monitores.find({actividades: {$exists: true}}) // Devolver los documentos que contengan el campo actividades

// Método findOne()

// sintaxis

// db.<colección>.findOne({consulta},{proyección})

// Devuelve el primer resultado de la consulta

// Se usa mucho a nivel DBA o DEV para comprobar el modelo de una colección (devuelve pretty)

db.clientes.findOne({dni: '07456189D'})

// Operadores de comparación

// $gte $gt $lte $lt

// $eq

db.clientes.find({dni: {$eq: '07456189D'}}) // Equivalente a la asignación "directa"

// $in recibe un array con las posibles coincidencias y funciona como un OR lógico

db.clientes.find({clases: {$in: ["zumba","pesas"]}}) // Devolverá los documentos en los que el campo clases tenga zumba o pesas

db.clientes.find({nombre: {$in: ["José","María"]}}) // Aunque se suele usar en arrays, también se puede usar con campos con otros tipos

// Uso de expresiones regulares

db.clientes.find({clases: {$in: ["zumba",/^p/]}}) // Devolvería los documentos que tengan en el campo clases el valor zumba o cualquier 
                                                // valor que cumpla la expresión regular, en este caso es que comience por p minúscula
// Advertencia: $in no es compatible con el operador $regex

// $ne

db.clientes.find({apellidos: {$ne: "García"}}) // Devolvera los documentos en los que apellidos no sea igual a García y los que
                                               // no tenga el campo apellidos
db.clientes.find({apellidos: {$ne: "García", $exists: true}}) // Excluye los que no tengan el campo apellidos

// $nin

db.clientes.find({nombre: {$nin: ["Carlos","María"]}},{_id:0, nombre: 1})  // Devuelve todos los que no se llamen Carlos o no se llamen María

// Just for fun :)
db.clientes.find({nombre: {$ne: "María", $ne: "Carlos"}},{_id:0, nombre: 1}) // No



// Operadores lógicos

// $ and

// recibe array con las expresiones que necesitemos

db.clientes.find({$and: [{nombre: {$ne: "María"}},{nombre: {$ne: "Carlos"}}]},{_id:0, nombre: 1}) // Si

// En que se diferencia $and de la coma and implícita

// db.clientes.find( {
//     $and: [
//         { $or: [ { edad: { $lt : 18 } }, { qty : { $gt: 50 } } ] },
//         { $or: [ { sale: true }, { price : { $lt : 5 } } ] }
//     ]
// } )





// $ or

db.clientes.find({$or: [{edad: {$gte: 18}}, {nombre: "José", edad: {$exists: true}}]})

// $not Devuelve los que no cumplen la expresión que se le pasa al operador o no tienen el campo

db.clientes.find({edad: {$not: {$gte: 18}}},{_id: 0, nombre: 1, edad: 1}) // Devuelve los que no tengan el campo

db.clientes.find({edad: {$lt: 18}},{_id: 0, nombre: 1, edad: 1})  // Este no devuelve los que no tengan el campo

// $ nor Recibe array de expresiones Selecciona los documentos que incumplen alguna de las expresiones

db.clientes.find({$nor : [
    {edad: {$lt: 18}}, 
    {nombre: "María"}
]},{_id: 0, edad: 1, nombre: 1})

// o

db.clientes.find({$nor: [{nombre: "María"},{nombre: "Carlos"}]},{_id:0, nombre: 1})

// Operadores de evaluación

// $regex Utilizar expresiones regulares admite opciones


