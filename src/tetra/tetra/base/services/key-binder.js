import document from 'document'

export default class KeyBinder {
  constructor (bindings) {
    this.bindings = bindings
    this.enable()
  }
  enable () {
    document.addEventListener('keydown', this.handleKeyDown.bind(this))
  }
  disable () {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this))
  }
  handleKeyDown (event) {
    let code = event.which
    let key = String.fromCharCode(code)
    if (key in this.bindings) {
      this.bindings[key]()
    }
    if (code in this.bindings) {
      this.bindings[code]()
    }
  }
}
