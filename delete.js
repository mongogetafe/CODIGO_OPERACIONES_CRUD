// Método remove() (no avisa)

// db.<coleccion>.remove(
//   <doc-consulta>    // Por defecto el método elimina todos los elementos que seleccione la consulta
//   justOne: true | false    
// )

// No puede ser utilizado con las capped collections

db.libros.remove({autor: /John/}) // Eliminará todos los docs en los que autor contenga "John"

db.libros.remove({}) // Eliminará todos los registros pero mantiene la colección vacía (para eliminar colección se usa .drop())

// deleteOne() idem a remove() con justOne igual a true
// deleteMany() idem a remove()