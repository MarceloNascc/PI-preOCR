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

  // verify if the point has match with the mask
  erode(
    { matrix, startHeight, startWidth, imageHeight, imageWidth },
    { mask, maskHeight, maskWidth },
  ) {
    // limit verifications
    if (imageHeight < startHeight || (imageHeight - startHeight) < maskHeight) { // height verification
      return false;
    } else if (imageWidth < startWidth || (imageWidth - startWidth) < maskWidth) { //width verification
      return false;
    }

    let result = true;
    // check each point of the mask with the equivalent point of the image
    for (let height = 0; height < mask.length; height++) {
      for (let width = 0; width < mask[0].length; width++) {
        if (matrix[startHeight + height][startWidth + width] !== mask[height][width]) {
          result = false;
          break;
        }
      }

      // verify if already
      if (!result) {
        break;
      }
    }

    return result;
  }

  // create a rectangle in the image
  createRectangle(imageMatrix, startRec, endRec, height) {
    // create vertical lines
    for (let current = startRec[0]; current <= startRec[0] + height; current++) {
      imageMatrix[current][startRec[1]] = 1;
      imageMatrix[current][endRec[1]] = 1;
    }

    // create horizontal lines
    for (let current = startRec[1]; current <= endRec[0]; current++) {
      imageMatrix[startRec[0]][current] = 1;
      imageMatrix[startRec[0] + height][current] = 1;
    }

    return imageMatrix;
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
    if (neighborsArray.filter(x => x === 0).length >= 5) {
      return 0;
    }
    return 1;
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