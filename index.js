var EventEmitter = require('events')
var util = require('util')
var docker = require('docker-remote-api')
var ndjson = require('ndjson')
var pump = require('pump')
var through = require('through2')
var camelCase = require('camelcase-keys')

module.exports = Emitter

function noop () {}

function Emitter (opts) {
  if (!(this instanceof Emitter)) return new Emitter(opts)

  this._opts = opts
}

util.inherits(Emitter, EventEmitter)

Emitter.prototype.start = function (cb) {
  this._stream = events(cb || noop)
  this._stream.on('data', (data) => {
    var formated = camelCase(data)
    var name = `${formated.type}:${formated.action}`
    this.emit('*', formated)
    this.emit(name, formated)
  })
}

Emitter.prototype.stop = function (cb) {
  this._stream.end(cb || noop)
}

function events (opts, cb) {
  if (!cb) return events({}, opts)
  if (!opts) opts = {}

  var request = docker(opts.host, {version: 'v1.31'})
  var result = through.obj()

  var qs = {
    since: opts.since,
    until: opts.until,
    filters: opts.filters
  }

  request.get('/events', {qs: qs}, function (err, stream) {
    if (err) return cb(err)
    pump(stream, ndjson.parse(), result)
    cb(null, result)
  })

  return result
}
