const gulp = require('gulp')
const { IcosaServer } = require('../src/icosa')

const icosaServer = new IcosaServer()

gulp.task('icosa', () => {
  console.log('IcosaServer listening on port 9000')
  icosaServer.listen(9000)
})
