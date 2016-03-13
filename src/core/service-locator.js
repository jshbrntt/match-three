export default class ServiceLocator {
  static provide(service) {
    if (!this._services) {
      this._services = {};
    }
    this._services[service.constructor.name] = service;
  }
  static get(name) {
    if (this._services.hasOwnProperty(name)) {
      return this._services[name];
    }
    else {
      throw new ReferenceError(`Service '${name}' not found.`);
    }
  }
}
