global.__base = __dirname
const requireDir = require('require-dir')
requireDir('tasks', {
  recurse: true
})
