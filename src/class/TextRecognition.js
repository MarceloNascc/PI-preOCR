const BORDER = 40;
class TextRecognition {
  constructor(image, imageResult, operator) {
    this.emptySpaceHeight = 80; // the height of space mask (letter height)
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
  _findStartLine(inicialPosition) {
    const matrix = this.image.getMatrix();

    for (let currentLine = inicialPosition; currentLine < this.image.getHeight() - BORDER; currentLine++) { // ignore the border
      for (let currentPixel = BORDER; currentPixel < this.image.getWidth() - BORDER; currentPixel++) { // ignore the border
        if (matrix[currentLine][currentPixel] === 1) { //first black point
          return currentLine;
        }
      }
    }

    return this.image.getHeight() - 1; // not have text
  }

  _findLineHeight(inicialPosition){
    const matrix = this.image.getMatrix();

    for (let currentLine = inicialPosition; currentLine < this.image.getHeight() - BORDER; currentLine++) { // ignore the border
      let isBlankLine = true;

      for (let currentPixel = BORDER; currentPixel < this.image.getWidth() - BORDER; currentPixel++) { // ignore the border
        if (matrix[currentLine][currentPixel] === 1) { //first black point
          isBlankLine = false;
          break;
        }
      }

      if(isBlankLine){
        return currentLine;
      }
    }

    console.log(`Not find blank line: ${inicialPosition}`);
    return inicialPosition + this.emptySpaceHeight; // return mask height
  }

  // find last line of the text
  _findLastLine() {
    const matrix = this.image.getMatrix();

    for (let currentLine = this.image.getHeight() - BORDER; currentLine > BORDER; currentLine--) { // ignore the border
      for (let currentPixel = this.image.getWidth() - BORDER; currentPixel > BORDER; currentPixel--) { // ignore the border
        if (matrix[currentLine][currentPixel] === 1) { //last black point
          console.log(`Last line: ${currentLine}`);
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
    let startWord = { line: 0, column: 0 }; // position where the current word start
    let endWord = { line: 0, column: 0 }; // position where the current word end

    let currentLine = this._findStartLine(BORDER); // ignore border
    let endLine = this._findLineHeight(currentLine);
    const lastLine = this._findLastLine();
    while (currentLine < lastLine) {
      this.linesCount++;

      let currentPixel = BORDER; // ignore the border
      while (currentPixel < this.image.getWidth() - BORDER) { // ignore the border
        if (isInWord) {
          const stillInWord = !this.operator.erode(
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
            endWord = { line: currentLine, column: currentPixel };
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
          const inWord = !this.operator.erode(
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
            startWord = { line: currentLine, column: currentPixel };
            currentPixel++;
            this.wordsCount++;
          } else { // not find a black point then add mask width
            currentPixel += this.emptySpaceWidth;
          }
        }
      }

      console.log(`Start line: ${currentLine} || End Line: ${endLine}`);
      currentLine = this._findStartLine(endLine);
      if(currentLine > lastLine) { // already verify last line
        break;
      }
      endLine = this._findLineHeight(currentLine);
    }
  }
}

module.exports = TextRecognition;