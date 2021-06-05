const { readFile, writeFile } = require('fs');
const { promisify } = require('util');

class Image {
  async init(path) {
    this._image = await Image.readImageFile(path);
  }

  static async readImageFile(path) {
    const file = await promisify(readFile)(path, { encoding: 'ascii' });
    const lines = file.split('\n');

    let header = '';
    let width = 0, height = 0;
    let indexCurrent = 0, countLines = 0;

    while (true) {
      if (lines[indexCurrent][0] !== '#' && countLines < 2) {
        header += `${lines[indexCurrent]}\n`;
        if (countLines === 1) { //current line is second line of the header
          const [w, h] = lines[indexCurrent].split(' ');
          width = parseInt(w);
          height = parseInt(h);
        }

        indexCurrent++;
        countLines++;
      } else if (lines[indexCurrent][0] === '#') { //is a commentary
        header += `${lines[indexCurrent]}\n`;
        indexCurrent++;
      } else { //header end
        break;
      }
    }

    const matrix = [];
    let currentLine = [];
    let countPixels = 0;
    lines.slice(indexCurrent).forEach((line) => {
      if (line !== '') {
        line.split('').forEach((pixel) => {
          if ((countPixels + 1) % width !== 0) { //current line is not complete
            currentLine.push(parseInt(pixel));
          } else { //last of the line
            currentLine.push(parseInt(pixel));
            matrix.push(currentLine);
            currentLine = [];
          }

          countPixels++;
        });
      }
    });

    return {
      header,
      matrix,
      width,
      height
    };
  }

  static async writeImageFile(path, image) {
    let textToNewFile = image.header;

    image.matrix.forEach(line => textToNewFile += `${line.join('')}\n`);

    await promisify(writeFile)(path, textToNewFile, { encoding: 'ascii' });
  }

  async saveImage(pathToSave) {
    await Image.writeImageFile(pathToSave, this._image);
  }

  getMatrix() {
    return [...this._image.matrix];
  }

  setMatrix(matrix) {
    this._image.matrix = matrix;
  }

  getWidth() {
    return this._image.width;
  }

  getHeight() {
    return this._image.height;
  }
}

module.exports = Image;