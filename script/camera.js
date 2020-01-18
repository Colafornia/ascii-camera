var camera = (function () {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

  var constraints = {
    video: {
      width: 160,
      height: 160,
      frameRate: 30,
    },
    audio: false
  }
  // play video stream
  function gotMediaStream(stream) {
    player.srcObject = stream;
  }

  function handleError(err) {
    console.log('getUserMedia error:', err);
  }

  function initCamera() {
    if (navigator.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
          gotMediaStream(stream);
          initCanvas();
        })
        .catch(handleError);
    } else {
      alert('Your browser is not supported for navigator.getUserMedia API');
      return 'Your browser is not supported';
    }
  }

  function initCanvas() {
    canvas = document.createElement('canvas')
    canvas.setAttribute('width', 160);
    canvas.setAttribute('height', 160);

    context = canvas.getContext('2d');
    player.play();
    drawAscii();
  }

  function drawAscii() {
    container.style.display = 'block';
    var photoDOM = document.querySelector('#photo');
    if (photoDOM) {
      content.removeChild(photoDOM);
    }
    renderTimer = setInterval(function () {
      try {
        context.drawImage(player, 0, 0, 160, 160);
        ascii.draw(canvas);
      } catch (e) {
        // TODO
      }
    }, Math.round(1000 / 30));
  }

  function capture() {
    clearInterval(renderTimer);
    domtoimage.toPng(container)
      .then(function (dataUrl) {
        container.style.display = 'none';
        var img = new Image();
        img.id = 'photo';
        img.src = dataUrl;
        img.title = 'Right click and save to download';
        content.appendChild(img);
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  }
  return {
    init: initCamera,
    draw: drawAscii,
    capture,
  }
}())