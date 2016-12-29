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

})();