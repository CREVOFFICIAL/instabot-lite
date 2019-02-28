class Console {
  constructor() {
    this.MAP_COLORS = require("./../types").MAP_COLORS;
  }
  log(type, func, message) {
    let color = this.MAP_COLORS[type];
    console.log(`${type} ${func}: ${message}`[color]);
  }
}

module.exports = () => {
  return new Console();
};
