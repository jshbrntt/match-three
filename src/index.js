require('./manifest.json');
require('./index.css');
import M3Engine from './m3/m3engine';
var m3engine = new M3Engine();
console.warn = () => {};
