import document from 'document'

export default class KeywordBinder {
  constructor (bindings) {
    this.bindings = bindings
    this.enabled = false
    this.buffer = ''
    this.listener = null
    this.maxLength = 0
    for (let binding in this.bindings) {
      this.maxLength = Math.max(this.maxLength, binding.length)
    }
    this.enable()
  }
  enable () {
    if (!this.enabled) {
      document.addEventListener('keydown', this.handleKeyDown.bind(this))
    }
  }
  disable () {
    if (this.enabled) {
      document.removeEventListener('keydown', this.handleKeyDown.bind(this))
    }
  }
  checkBuffer () {
    if (!this.buffer.length) return
    for (let binding in this.bindings) {
      if (this.buffer.includes(binding)) {
        this.bindings[binding]()
        this.buffer = ''
        return
      }
    }
    if (this.buffer.length >= this.maxLength) {
      this.buffer = ''
    }
  }
  handleKeyDown ($event) {
    let key = String.fromCharCode($event.which).toLowerCase()
    this.buffer += key
    for (let binding in this.bindings) {
      if (binding.indexOf(this.buffer) !== 0) {
        continue
      }
      if (binding.indexOf(this.buffer) === 0) {
        if (this.buffer === binding) {
          this.bindings[binding]()
        } else {
          return
        }
      }
    }
    this.buffer = key
  }
}
