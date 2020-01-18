var ascii = (function () {
  var container = document.getElementById('ascii');
  var characters = (' .,:;ox%#@').split('');
  // contrast correction factor
  // http://www.dfstudios.co.uk/articles/image-processing-algorithms-part-5/
  var contrastFactor = (259 * (128 + 255)) / (255 * (259 - 128));

  function drawASCIICanvas(canvas) {
    var ctx = canvas.getContext('2d');
    var asciiCharacters = '';
    // Is a Uint8ClampedArray representing a one-dimensional array containing the data in the RGBA order,
    // with integer values between 0 and 255
    var imageData = ctx.getImageData(0, 0, 160, 160).data;
    for (var y = 0; y < 160; y += 2) { // every other row because letters are not square
      for (var x = 0; x < 160; x += 1) {
        // get each pixel's brightness and output corresponding character
        // every 4 items in Uint8ClampedArray representing a pixel
        // every row contains 160 pixels
        // so such as pixel at (1,2), it's data in Uint8ClampedArray is:
        // (1*160 + 2)*4
        var offset = (y * 160 + x) * 4;
        var color = getColorAtOffset(imageData, offset);
        // increase the contrast of the image so that the ASCII representation looks better
        // R' = F(R-128)+128
        // http://www.dfstudios.co.uk/articles/image-processing-algorithms-part-5/
        var contrastedColor = {
          red: bound(Math.floor((color.red - 128) * contrastFactor) + 128, [0, 255]),
          green: bound(Math.floor((color.green - 128) * contrastFactor) + 128, [0, 255]),
          blue: bound(Math.floor((color.blue - 128) * contrastFactor) + 128, [0, 255]),
          alpha: color.alpha
        };

        // calculate pixel brightness
        // Digital ITU BT.601 (gives more weight to the R and B components)
        // http://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
        var brightness = (0.299 * contrastedColor.red + 0.587 * contrastedColor.green + 0.114 * contrastedColor.blue) / 255;

        var character = characters[(characters.length - 1) - Math.round(brightness * (characters.length - 1))];

        asciiCharacters += character;
      }

      asciiCharacters += '\n';
    }
    container.innerHTML = asciiCharacters
  }

  function getColorAtOffset(data, offset) {
    // RGBA in order
    return {
      red: data[offset],
      green: data[offset + 1],
      blue: data[offset + 2],
      alpha: data[offset + 3]
    };
  }

  function bound(value, interval) {
    // Make sure that RGBA value ranges in [0 , 255]
    return Math.max(interval[0], Math.min(interval[1], value));
  }

  return {
    draw: drawASCIICanvas
  }
}())