const { join } = require('path');
const Image = require('./class/Image');
const Operator = require('./class/Operator');
const TextRecognition = require('./class/TextRecognition');

(async function () {
  const image = new Image();
  const imageResult = new Image();
  await image.init(join(__dirname, 'assets', 'grupo_10_imagem_3_linhas_33_palavras_497.pbm'));
  await imageResult.init(join(__dirname, 'assets', 'grupo_10_imagem_3_linhas_33_palavras_497.pbm'));

  const operator = new Operator();

  image.setMatrix(
    operator.medianFilter(
      image.getMatrix(),
      image.getHeight(),
      image.getWidth()
    )
  );
  imageResult.setMatrix(image.getMatrix());

  const textRecognition = new TextRecognition(image, imageResult, operator);
  textRecognition.findWords();

  console.log(`Palavras: ${textRecognition.wordsCount}`);
  console.log(`Linhas: ${textRecognition.linesCount}`);
  // image.setMatrix(operator.negative(image.getMatrix(), 1));

  await imageResult.saveImage(join(__dirname, 'assets', 'image4Result.pbm'));
})();