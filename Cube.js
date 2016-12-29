(() => {

  class Cube {

    constructor() {
      this.body = _initBody();
    }

    rotate(x, y, z) {
      let transform = this.body.style.transform || 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
      let rX = parseInt(transform.match(/rotateX\((\-*\d+)deg\)/).pop()) + x;
      let rY = parseInt(transform.match(/rotateY\((\-*\d+)deg\)/).pop()) + y;
      let rZ = parseInt(transform.match(/rotateZ\((\-*\d+)deg\)/).pop()) + z;
      this.body.style.transform = `rotateX(${rX}deg) rotateY(${rY}deg) rotateZ(${rZ}deg)`;
    }

  };

  window.Cube = Cube;

  const _initBody = () => {
    const body = document.querySelector('#cube');

    _initFace(body, 'red', 0, 0);
    _initFace(body, 'white', 90, 0);
    _initFace(body, 'yellow', -90, 0);
    _initFace(body, 'green', 0, -90);
    _initFace(body, 'blue', 0, 90);
    _initFace(body, 'orange', 0, 180);

    return body;
  };

  const _initFace = (container, name, rX, rY) => {
    const face = document.createElement('div');
    face.className = `face face-${name}`;

    for (let i = 0; i < 9; i++) {
      const square = document.createElement('div');
      square.className = `square square-${name}`;
      square.style.transform = `
        rotateX(${rX}deg) 
        rotateY(${rY}deg) 
        rotateZ(0deg)
        translateX(${100 * ((i % 3) - 1)}px)
        translateY(${100 * (Math.floor(i / 3) - 1)}px)
        translateZ(150px)
      `;

      face.appendChild(square);
    }

    container.appendChild(face);
  };

})();