class Operator {
  // operação para aplicar a negação na imagem (inverte as cores)
  negative(matrix, maxValue) {
    matrix
      // para cada linha da imagem, altera o valor de cada um dos pixels
      .forEach((line, currentLine) => {
        line.forEach((pixel, currentPos) => {
          matrix[currentLine][currentPos] = maxValue - pixel;
        });
      });

    return matrix;
  }

  // operação para aplicar o filtro da mediana
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

  // helper function para calcular a mediana em um ponto da imagem
  _calcMedian(neighborsArray) {
    neighborsArray.sort();
    const length = neighborsArray.length;

    return neighborsArray[Math.floor(length / 2)];
  }

  // helper function para pegar os vizinhos de um pixel
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