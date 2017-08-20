import document from 'document'

export default class KeyBinder {
  constructor (bindings) {
    this.bindings = bindings
    this.states = {}
    this.enabled = false
    this.enable()
  }
  held (code) {
    if (code in this.states) {
      return this.states[code]
    }
    return false
  }
  enable () {
    if (!this.enabled) {
      document.addEventListener('keydown', this.handleKeyDown.bind(this))
      document.addEventListener('keyup', this.handleKeyUp.bind(this))
    }
  }
  disable () {
    if (this.enabled) {
      document.removeEventListener('keydown', this.handleKeyDown.bind(this))
      document.removeEventListener('keyup', this.handleKeyUp.bind(this))
    }
  }
  updateState (keyInfo, state) {
    this.states[keyInfo.code] = state
    this.states[keyInfo.key] = state
  }
  callBindings (keyInfo, code) {
    if (keyInfo.string in this.bindings) {
      this.bindings[keyInfo.string]()
    }
    if (keyInfo.code in this.bindings) {
      this.bindings[keyInfo.code]()
    }
  }
  getKeyInfo (event) {
    return {
      code: event.which,
      string: String.fromCharCode(event.which)
    }
  }
  handleKeyDown (event) {
    let keyInfo = this.getKeyInfo(event)
    this.updateState(keyInfo, true)
    this.callBindings(keyInfo)
  }
  handleKeyUp (event) {
    let keyInfo = this.getKeyInfo(event)
    this.updateState(keyInfo, false)
    this.callBindings(keyInfo)
  }
}
