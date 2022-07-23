import DropZone from './DropZone.js'
import KanbanAPI from '../api/KanbanAPI.js'

export default class Item {
  constructor(id, content) {
    const bottomDropZone = DropZone.createDropZone()

    this.elements = {}
    this.elements.root = Item.createRoot()
    this.elements.input = this.elements.root.querySelector(
      '.kanban__item-input',
    )

    this.elements.root.dataset.id = id
    this.elements.input.textContent = content
    this.content = content
    this.elements.root.appendChild(bottomDropZone)

    const onBlur = () => {
      const newContent = this.elements.input.textContent.trim()

      if (newContent == this.content) {
        return
      }

      this.content = newContent

      KanbanAPI.updateItem(id, {
        //-> Actualizo el nuevo contenido
        content: this.content,
      })
    }

    this.elements.input.addEventListener('blur', onBlur)
    this.elements.root.addEventListener('dblclick', () => {
      const check = confirm('You really want to delete this card?')

      if (check) {
        KanbanAPI.deleteItem(id) //-> Lo elimino del Local storage
        this.elements.input.removeEventListener('blur', onBlur)
        this.elements.root.parentElement.removeChild(this.elements.root) //-> Lo remuevo de la interfaz HTML
      }
    })

    this.elements.root.addEventListener('dragstart', (e) => {
      //-> Hago las cartas "draggable"
      e.dataTransfer.setData('text/plain', id)
    })

    this.elements.input.addEventListener('drop', (e) => {
      e.preventDefault()
    })
  }

  static createRoot() {
    const range = document.createRange()

    range.selectNode(document.body)

    return range.createContextualFragment(`
			<div class="kanban__item" draggable="true">
				<div class="kanban__item-input" contenteditable></div>
			</div>
		`).children[0]
  }
}
