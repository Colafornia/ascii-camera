  var context;
  var content = document.querySelector('.content');
  var player = document.querySelector('video#player');
  var button = document.querySelector('.button');
  var container = document.getElementById("ascii");
  var renderTimer = null;
  button.addEventListener('click', function () {
    const type = button.innerHTML;
    switch (type) {
      case 'Start':
        var text = camera.init();
        this.innerHTML = text || 'Capture';
        break;
      case 'Capture':
        camera.capture();
        this.innerHTML = 'Resume';
        break;
      case 'Resume':
        camera.draw();
        this.innerHTML = 'Capture';
        break;
      default:
        console.log('unknown');
    }
  })
