/* eslint-env mocha */

require('should')
const shellies = require('shellies')
const sinon = require('sinon')

const Homebridge = require('./mocks/homebridge')

const homebridge = new Homebridge()

const LightbulbAbility = require('../abilities/lightbulb')(homebridge)

describe('LightbulbAbility', function() {
  let device = null
  let ability = null
  let update = null

  beforeEach(function() {
    device = shellies.createDevice('SHDM-2', 'ABC123', '192.168.1.2')
    device.switch0 = true
    device.brightness0 = 80
    ability = new LightbulbAbility('switch0', 'brightness0', () => {})
    ability.device = device
    update = sinon.stub(ability, '_updateDeviceLightDebounced')
  })

  afterEach(function() {
    sinon.restore()
    device.removeAllListeners()
  })

  describe('#_onSetHandler()', function() {
    it('should skip unchanged values when the device is online', function() {
      device.online = true
      ability._onSetHandler(true, () => {})
      update.called.should.be.false()
    })

    it('should send changed values when the device is online', function() {
      device.online = true
      ability._onSetHandler(false, () => {})
      update.calledOnce.should.be.true()
    })

    it('should send unchanged values when the device is offline', function() {
      // cached state is stale once status updates stop arriving
      device.online = false
      ability._onSetHandler(true, () => {})
      update.calledOnce.should.be.true()
    })
  })

  describe('#_brightnessSetHandler()', function() {
    it('should send unchanged values when the device is offline', function() {
      device.online = false
      ability._brightnessSetHandler(80, () => {})
      update.calledOnce.should.be.true()
    })
  })
})
