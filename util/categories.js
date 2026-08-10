module.exports = homebridge => {
  // hap-nodejs v1+ (Homebridge 2.x) exposes Categories as its own export;
  // older versions attach it to the Accessory class
  return homebridge.hap.Categories ||
    (homebridge.hap.Accessory && homebridge.hap.Accessory.Categories)
}
