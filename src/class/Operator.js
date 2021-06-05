class Operator {
  negative(matrix, maxValue) {
    matrix
      .forEach((line, currentLine) => {
        line.forEach((pixel, currentPos) => {
          matrix[currentLine][currentPos] = maxValue - pixel;
        });
      });

    return matrix;
  }

  medianFilter(matrix, height, width) {
    const result = [];
    for (const line of matrix) {
      const copyLine = [];
      for (const pixel of line) {
        copyLine.push(pixel);
      }
      result.push(copyLine);
    }

    matrix
      .forEach((line, currentLine) => {
        if (currentLine !== (height - 1) && currentLine !== 0) { //last line or first line - out of the range
          line
            .forEach((_, currentPixel) => {
              if (currentPixel !== (width - 1) && currentPixel !== 0) { //last column or first column - out of the range
                const neighbors = this._getNeighbors(matrix, currentLine, currentPixel);

                result[currentLine][currentPixel] = this._calcMedian(neighbors); //set median value
              }
            });
        }
      });

    return result;
  }

  _calcMedian(neighborsArray) {
    neighborsArray.sort();
    const length = neighborsArray.length;

    return neighborsArray[Math.floor(length / 2)];
  }

  _getNeighbors(matrix, currentLine, currentPixel) {
    const neighbors = [];

    for (let i = currentLine - 1; i <= currentLine + 1; i++) { //get neighbors
      for (let j = currentPixel - 1; j <= currentPixel + 1; j++) {
        neighbors.push(matrix[i][j]);
      }
    }

    return neighbors;
  }
}

module.exports = Operator;