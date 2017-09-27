var tape = require('tape')
var run = require('docker-run')
var Docker = require('./')

var CONTAINER_LIFECYCLE = [
  'container:create',
  'container:attach',
  'network:connect',
  'container:start',
  'container:die',
  'network:disconnect',
  'container:destroy'
]

tape('docker-events', function (t) {
  t.test('should return an instance', function (t) {
    t.plan(1)
    t.ok(Docker() instanceof Docker, 'returns an instance')
  })

  // requires docker running

  t.test('should emitt events', function (t) {
    var container
    var docker = Docker()

    t.plan(CONTAINER_LIFECYCLE.length)

    CONTAINER_LIFECYCLE.forEach(function (eventName) {
      docker.on(eventName, function (event) {
        t.equal(eventName, `${event.type}:${event.action}`, eventName)
      })
    })

    docker.start()
    container = run('hello-world')
    container.on('exit', function (code) {
      container.destroy(function () {
        docker.stop()
      })
    })
  })

  t.test('should trigger wildcard', function (t) {
    var container
    var docker = Docker()

    t.plan(CONTAINER_LIFECYCLE.length)

    docker.on('*', function (event) {
      t.pass('called')
    })

    docker.start()
    container = run('hello-world')
    container.on('exit', function (code) {
      container.destroy(function () {
        docker.stop()
      })
    })
  })

  t.test('should stop listening', function (t) {
    var container
    var docker = Docker()

    docker.on('*', function (event) {
      t.fail('called')
    })

    docker.start(function () {
      docker.stop(function () {
        container = run('hello-world')
        container.on('exit', function (code) {
          container.destroy(function () {
            t.end()
          })
        })
      })
    })
  })
})
