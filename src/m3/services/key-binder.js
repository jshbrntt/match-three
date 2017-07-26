import document from 'document'

export default class KeyBinder {
  constructor (bindings) {
    this.bindings = bindings
  }
  enable () {
    document.on('keydown', this.handleKeyDown.bind(this))
  }
  disable () {
    document.off('keydown', this.handleKeyDown.bind(this))
  }
  handleKeyDown ($event) {
    let key = String.fromCharCode($event.which).toLowerCase()
    if (key in this.bindings) {
      this.bindings[key]()
    }
  }
}
