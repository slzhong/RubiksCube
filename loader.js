(() => {

  let cube;

  window.onload = () => {
    _initCube();
    _initEvents();
  };

  function _initCube() {
    cube = new Cube();
  }

  function _initEvents() {
    document.onkeydown = _handleKeyDown;
  }

  function _handleKeyDown(e) {
    if (e.keyCode >= 37 && e.keyCode <= 40) {
      _rotateCube(e.keyCode);
    } else if (e.keyCode == 83) {
      _shuffleCube();
    } else {
      _moveCube(e);
    }
  };

  function _rotateCube(direction) {
    switch (direction) {
      case 38:
        cube.rotate(10, 0, 0);
        break;
      case 40:
        cube.rotate(-10, 0, 0);
        break;
      case 37:
        cube.rotate(0, -10, 0);
        break;
      case 39:
        cube.rotate(0, 10, 0);
        break;
      default:
        break;
    }  
  };

  function _moveCube(e) {
    let step = e.shiftKey ? -1 : 1;
    let face;
    if (e.keyCode == 70) {
      face = 'front';
    } else if (e.keyCode == 66) {
      face = 'back';
    } else if (e.keyCode == 85) {
      face = 'up'
    } else if (e.keyCode == 68) {
      face = 'down';
    } else if (e.keyCode == 76) {
      face = 'left';
    } else if (e.keyCode == 82) {
      face = 'right';
    }

    if (face) {
      cube.move(face, step);
    }
  }

  function _shuffleCube() {
    cube.shuffle();
  }

})();