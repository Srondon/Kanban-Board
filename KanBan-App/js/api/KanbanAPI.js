export default class KanbanAPI {
  static getItems(columnId) {
    const column = read().find((column) => column.id == columnId)

    if (!column) {
      return []
    }

    return column.items
  }

  static insertItem(columnId, content) {
    const data = read()
    const column = data.find((column) => column.id == columnId)
    const item = {
      id: Math.floor(Math.random() * 100000), //-> Genero el Id por un método aleatorio para esto
      content,
    }

    if (!column) {
      throw new Error('Column does not exist.')
    }

    column.items.push(item)
    save(data)

    return item
  }

  static updateItem(itemId, newProps) {
    //-> NewProps: Información a actualizar del item
    const data = read()
    const [item, currentColumn] = (() => {
      //-> Función flecha con estructura de arreglo
      for (const column of data) {
        const item = column.items.find((item) => item.id == itemId)

        if (item) {
          return [item, column]
        }
      }
    })()

    if (!item) {
      throw new Error('Item not found.')
    }

    item.content =
      newProps.content === undefined ? item.content : newProps.content

    //-> Actualizar columna y pocisión - Por si el usuario mueve la carta
    if (newProps.columnId !== undefined && newProps.position !== undefined) {
      //-> Position: 1, 2, 3. [Columnas quemadas]
      const targetColumn = data.find((column) => column.id == newProps.columnId)

      if (!targetColumn) {
        throw new Error('Target column not found.')
      }
      //-> Borrar el item de su pocisión actual
      currentColumn.items.splice(currentColumn.items.indexOf(item), 1) //-> 1: Borra 1
      //-> Mover el item a su nueva columna y respectiva posición
      targetColumn.items.splice(newProps.position, 0, item) //-> 0: No borra nada, solo hace una inserción
    }

    save(data)
  }

  static deleteItem(itemId) {
    const data = read()

    for (const column of data) {
      const item = column.items.find((item) => item.id == itemId)

      if (item) {
        //-> Si no lo encuentra con el Id, pasa de columna
        column.items.splice(column.items.indexOf(item), 1)
      }
    }

    save(data)
  }
}

function read() {
  const json = localStorage.getItem('kanban-data') //Lee directamente desde el Local Storage
  if (!json) {
    //-> Esto se lee solo cuando el usuario usa el kanban por la primera vez
    return [
      {
        id: 1,
        items: [],
      },
      {
        id: 2,
        items: [],
      },
      {
        id: 3,
        items: [],
      },
    ]
  }

  return JSON.parse(json)
}

function save(data) {
  //-> Almaceno en el Local Storage
  localStorage.setItem('kanban-data', JSON.stringify(data))
}
