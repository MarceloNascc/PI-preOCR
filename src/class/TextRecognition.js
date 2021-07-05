class TextRecognition {
  constructor(image, imageResult, operator) {
    this.emptySpaceHeight = 120; // the height of space mask (letter height)
    this.emptySpaceWidth = 20; // the width of space mask
    this.spaceMask = (
      new Array(this.emptySpaceHeight))
      .fill((new Array(this.emptySpaceWidth))
        .fill(0)
      ); //create a mask with height X width dimensions

    this.image = image; // instance of Image class
    this.imageResult = imageResult; // instance of Image class
    this.operator = operator; // instance of Operator class

    this.wordsCount = 0;
    this.linesCount = 0;
  }

  // find first of the text
  _findStartLine() {
    const matrix = this.image.getMatrix();

    for (let currentLine = 1; currentLine < this.image.getHeight() - 1; currentLine++) { // ignore the border
      for (let currentPixel = 1; currentPixel < this.image.getWidth() - 1; currentPixel++) { // ignore the border
        if (matrix[currentLine][currentPixel] === 1) { //first black point
          return currentLine;
        }
      }
    }

    return 0; // not have text
  }

  // find last line of the text
  _findLastLine() {
    const matrix = this.image.getMatrix();

    for (let currentLine = this.image.getHeight() - 2; currentLine >= 1; currentLine--) { // ignore the border
      for (let currentPixel = this.image.getWidth() - 2; currentPixel >= 1; currentPixel--) { // ignore the border
        if (matrix[currentLine][currentPixel] === 1) { //last black point
          return currentLine;
        }
      }
    }

    return this.image.getHeight() - 1; // not have text
  }

  findWords() {
    const matrix = this.image.getMatrix();
    const imageHeight = this.image.getHeight();
    const imageWidth = this.image.getWidth();

    let isInWord = false; // the current position cotains a word
    let startWord = [0, 0]; // position where the current word start
    let endWord = [0, 0]; // position where the current word end

    for (let currentLine = this._findStartLine(); currentLine <= this._findLastLine(); currentLine += this.emptySpaceHeight) {
      this.linesCount++;

      let currentPixel = 1; // ignore the border
      while (currentPixel < this.image.getWidth() - 1) { // ignore the border
        if (isInWord) {
          const stillInWord = this.operator.erode(
            {
              matrix,
              startHeight: currentLine,
              startWidth: currentPixel,
              imageHeight,
              imageWidth
            },
            {
              mask: this.spaceMask,
              maskHeight: this.emptySpaceHeight,
              maskWidth: this.emptySpaceWidth
            }
          );

          if (!stillInWord) { // find end of the word
            isInWord = false;
            endWord = [currentLine, currentPixel];;
            currentPixel += this.emptySpaceWidth;

            this.imageResult.setMatrix(
              this.operator.createRectangle(
                this.imageResult.getMatrix(),
                startWord,
                endWord,
                this.emptySpaceHeight,
              ),
            );
          } else { // still in the word
            currentPixel++;
          }
        } else {
          const inWord = this.operator.erode(
            {
              matrix,
              startHeight: currentLine,
              startWidth: currentPixel,
              imageHeight,
              imageWidth
            },
            {
              mask: this.spaceMask,
              maskHeight: this.emptySpaceHeight,
              maskWidth: this.emptySpaceWidth
            }
          );

          if (inWord) { // find a black point then start a word
            isInWord = true;
            startWord = [currentLine, currentPixel];
            currentPixel++;
            this.wordsCount++;
          } else { // not find a black point then add mask width
            currentPixel += this.emptySpaceWidth;
          }
        }
      }
    }
  }
}

module.exports = TextRecognition;