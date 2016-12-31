(() => {

  let cube;
  let orientation;

  window.onload = () => {
    _initCube();
    _initEvents();
  };

  function _initCube() {
    cube = new Cube();
  }

  function _initEvents() {
    document.onkeydown = _handleKeyDown;
    window.addEventListener('deviceorientation', _handleOrientation, true);
  }

  function _handleKeyDown(e) {
    if (e.keyCode >= 37 && e.keyCode <= 40) {
      _rotateCube(e.keyCode);
    } else if (e.keyCode == 83) {
      _shuffleCube();
    } else if (e.keyCode == 32 && e.shiftKey) {
      _resetCube();
    } else if (e.keyCode == 32) {
      _repositionCube();
    } else  if (e.keyCode >= 49 && e.keyCode <= 57) {
      _easterCube(e.keyCode - 49);
    } else if (e.keyCode == 73) {
      _infiniteCube();
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
    } else if (e.keyCode == 88) {
      face = 'x';
    } else if (e.keyCode == 89) {
      face = 'y';
    } else if (e.keyCode == 90) {
      face = 'z';
    }

    if (face) {
      cube.move(face, step);
    }
  }

  function _shuffleCube() {
    cube.shuffle();
  }

  function _repositionCube() {
    cube.reposition();
  }

  function _resetCube() {
    console.log('wer');
    cube = new Cube();
  }

  function _easterCube(idx) {
    const easterNames = [
      'CHECKERBOARD',
      'CROSSES',
      'ROAMING CENTER'
    ];

    const easterMoves = [
      [['x', 1], ['x', 1], ['y', 1], ['y', 1], ['z', 1], ['z', 1]],
      [['x', 1], ['x', 1], ['y', 1], ['back', 1], ['back', 1], ['y', -1], ['y', -1], ['back', 1], ['back', 1], ['y', 1], ['z', 1], ['left', 1], ['left', 1], ['z', -1], ['z', -1], ['left', 1], ['left', 1], ['z', 1]],
      [['y', 1], ['x', 1], ['y', -1], ['x', -1], [null, 0], [null, 0], [null, 0], ['y', 1], ['x', 1], ['y', -1], ['x', -1], [null, 0], [null, 0], [null, 0], ['y', 1], ['x', 1], ['y', -1], ['x', -1]]
    ];

    if (idx < easterMoves.length) {
      document.getElementById('easter').innerHTML = easterNames[idx];
      const iter = setInterval(() => {
        if (easterMoves[idx].length <= 0) {
          clearInterval(iter);
          document.getElementById('easter').innerHTML = '';
        } else {
          const move = easterMoves[idx].shift();
          cube.move(move[0], move[1]);
        }
      }, 350);
    }
  }

  function _infiniteCube() {
    cube.body.style.transition = 'transform 0.3s linear';
    document.getElementById('hint').style.display = 'none';
    document.body.webkitRequestFullScreen();
    document.body.style.cursor = 'none';

    setInterval(() => {
      cube.rotate(2, 2, 2);
    }, 300);

    setInterval(() => {
      const moves = ['front', 'back', 'up', 'down', 'left', 'right', 'x', 'y', 'z'];
      cube.move(moves[Math.floor(Math.random() * moves.length)], Math.random() * 2 > 1 ? 1 : -1);
    }, 350);
  }

  function _handleOrientation(e) {
    if (!orientation) {
      _initOrientation();
    } else {
      document.getElementById('cube').style.transform = `
        rotateX(${e.beta * -0.5}deg)
        rotateY(${e.gamma * 0.5}deg)
      `;
    }
  }

  function _initOrientation() {
    orientation = true;

    document.getElementById('hint').style.display = 'none';
    document.getElementById('cube').style.transform = '';
    document.getElementById('cube').style.transition = '';
    // document.getElementById('cube').style.transformOrigin = '200px 200px';
  }

})();