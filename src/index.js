const { join } = require('path');
const Image = require('./class/Image');
const Operator = require('./class/Operator');
const TextRecognition = require('./class/TextRecognition');

(async function () {
  console.log(`start at ${new Date()}`);
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
  image.setMatrix(
    operator.medianFilter(
      image.getMatrix(),
      image.getHeight(),
      image.getWidth()
    )
  );
  imageResult.setMatrix(image.getMatrix().map(line => [...line])); // create a copy for the result

  const textRecognition = new TextRecognition(image, imageResult, operator);
  textRecognition.findWords();

  console.log(`Palavras: ${textRecognition.wordsCount}`);
  console.log(`Linhas: ${textRecognition.linesCount}`);

  await imageResult.saveImage(join(__dirname, 'assets', 'image3Result.pbm'));
  console.log(`end at ${new Date()}`);
})();