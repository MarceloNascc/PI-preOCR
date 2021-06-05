const { join } = require('path');
const Image = require('./class/Image');
const Operator = require('./class/Operator');

(async function () {
  const image = new Image();
  await image.init(join(__dirname, 'assets', 'lorem_s12_c02_espacos_noise.pbm'));
  // await image.init('./assets/test.pbm');

  const operator = new Operator();

  image.setMatrix(
    operator.medianFilter(
      image.getMatrix(),
      image.getHeight(),
      image.getWidth()
    )
  );
  // image.setMatrix(operator.negative(image.getMatrix(), 1));

  await image.saveImage(join(__dirname, 'assets', 'testFilter2.pbm'));
})();