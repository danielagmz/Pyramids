import configs from '../../configs.js';

export default class Map {
  constructor (width = configs.map.width, height = configs.map.height) {
    this.width = width;
    this.height = height;
    this.stones = [];
  }

  generateStones (count) {
    while (this.stones.length < count) {
      const position = this.generateRandomPosition();
      if (this.isPositionAvailable(position.x, position.y)) {
        this.stones.push(position);
      }
    }
  }

  isPositionAvailable (x, y) {
    return !this.stones.some(stone => stone.x === x && stone.y === y);
  }

  isValidPosition (x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  checkAreaColission (x, y, team) {
    if (team === 'purple') {
      if (x >= 0 && x <= 90 && y >= 0 && y <= 90) return true;
    } else {
      if (x >= this.width - 90 && x <= this.width && y >= this.height - 90 && y <= this.height) return true;
    }

    return false;
  }

  checkDropZone (x, y) {
    if (x >= 0 && x <= 90 && y >= 0 && y <= 90) return false;
    if (x >= this.width - 90 && x <= this.width && y >= this.height - 90 && y <= this.height) return false;
    return true;
  }

  generateRandomPosition () {
    const x = Math.floor(Math.random() * (this.width - 20));
    const y = Math.floor(Math.random() * (this.height - 20));
    if (x >= 0 && x <= 90 && y >= 0 && y <= 90) return this.generateRandomPosition();
    if (x >= this.width - 90 && x <= this.width && y >= this.height - 90 && y <= this.height) return this.generateRandomPosition();
    return { x, y };
  }

  setWidth (width) {
    if (width >= configs.map.maxWidth && width <= configs.map.minWidth) {
      this.width = width;
    }
  }

  setHeight (height) {
    if (height >= configs.map.maxHeight && height <= configs.map.minHeight) {
      this.height = height;
    }
  }

  getWidth () {
    return this.width;
  }

  getHeight () {
    return this.height;
  }

  addStone (x, y) {
    const newStone = {
      id: `brick${Date.now()}`,
      x,
      y,
      width: 20,
      height: 20
    };
    this.stones.push(newStone);
    return newStone;
  }
}
