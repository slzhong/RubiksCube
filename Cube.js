(() => {

  class Cube {

    constructor() {
      _initBody(this);
    }

    rotate(x, y, z) {
      let transform = this.body.style.transform || 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
      let triple = _getTransformValue(transform);
      this.body.style.transform = `
        rotateX(${triple.rX + x}deg) 
        rotateY(${triple.rY + y}deg) 
        rotateZ(${triple.rZ + z}deg)
      `;
    }

    move(face, step) {
      
    }

  };

  window.Cube = Cube;

  const _initBody = (self) => {
    self.body = document.querySelector('#cube');
    self.body.style.transform = `
      rotateX(-20deg) 
      rotateY(-30deg) 
      rotateZ(0deg)
    `;

    _initCenterCubelets(self);
    _initEdgeCubelets(self);
    _initCornerCubeletes(self);
  };

  const _initCenterCubelets = (self) => {
    _initCubelet(self, 0, 0, 100, [{
      color: 'white'
    }]);

    _initCubelet(self, 0, 0, -100, [{
      color: 'yellow'
    }]);

    _initCubelet(self, 0, -100, 0, [{
      color: 'red'
    }]);

    _initCubelet(self, 0, 100, 0, [{
      color: 'orange'
    }]);

    _initCubelet(self, 100, 0, 0, [{
      color: 'green'
    }]);

    _initCubelet(self, -100, 0, 0, [{
      color: 'blue'
    }]);
  };

  const _initEdgeCubelets = (self) => {
    _initCubelet(self, -100, 0, 100, [{
      color: 'blue'
    }, {
      color: 'white'
    }]);

    _initCubelet(self, 0, -100, 100, [{
      color: 'red'
    }, {
      color: 'white'
    }]);

    _initCubelet(self, 100, 0, 100, [{
      color: 'green'
    }, {
      color: 'white'
    }]);

    _initCubelet(self, 0, 100, 100, [{
      color: 'orange'
    }, {
      color: 'white'
    }]);

    _initCubelet(self, -100, 0, -100, [{
      color: 'blue'
    }, {
      color: 'yellow'
    }]);

    _initCubelet(self, 100, 0, -100, [{
      color: 'green'
    }, {
      color: 'yellow'
    }]);

    _initCubelet(self, 0, -100, -100, [{
      color: 'red'
    }, {
      color: 'yellow'
    }]);

    _initCubelet(self, 0, 100, -100, [{
      color: 'orange'
    }, {
      color: 'yellow'
    }]);

    _initCubelet(self, -100, -100, 0, [{
      color: 'blue'
    }, {
      color: 'red'
    }]);

    _initCubelet(self, -100, 100, 0, [{
      color: 'blue'
    }, {
      color: 'orange'
    }]);

    _initCubelet(self, 100, -100, 0, [{
      color: 'green'
    }, {
      color: 'red'
    }]);

    _initCubelet(self, 100, 100, 0, [{
      color: 'green'
    }, {
      color: 'orange'
    }]);
  };

  const _initCornerCubeletes = (self) => {
    _initCubelet(self, -100, -100, 100, [{
      color: 'red'
    }, {
      color: 'blue'
    }, {
      color: 'white'
    }]);

    _initCubelet(self, 100, -100, 100, [{
      color: 'red'
    }, {
      color: 'green'
    }, {
      color: 'white'
    }]);

    _initCubelet(self, -100, 100, 100, [{
      color: 'orange'
    }, {
      color: 'blue'
    }, {
      color: 'white'
    }]);

    _initCubelet(self, 100, 100, 100, [{
      color: 'orange'
    }, {
      color: 'green'
    }, {
      color: 'white'
    }]);

    _initCubelet(self, -100, -100, -100, [{
      color: 'red'
    }, {
      color: 'blue'
    }, {
      color: 'yellow'
    }]);

    _initCubelet(self, 100, -100, -100, [{
      color: 'red'
    }, {
      color: 'green'
    }, {
      color: 'yellow'
    }]);

    _initCubelet(self, -100, 100, -100, [{
      color: 'orange'
    }, {
      color: 'blue'
    }, {
      color: 'yellow'
    }]);

    _initCubelet(self, 100, 100, -100, [{
      color: 'orange'
    }, {
      color: 'green'
    }, {
      color: 'yellow'
    }]);
  };

  const _initCubelet = (self, tX, tY, tZ, squares) => {
    const colorMap = {
      white: {
        tZ: 50,
        facing: 'front'
      },
      yellow: {
        tZ: -50,
        facing: 'back'
      },
      red: {
        rX: 90,
        tZ: 50,
        facing: 'up'
      },
      orange: {
        rX: 90,
        tZ: -50,
        facing: 'down'
      },
      blue: {
        rY: 90,
        tZ: -50,
        facing: 'left'
      },
      green: {
        rY: 90,
        tZ: 50,
        facing: 'right'
      }
    };

    const cubelet = document.createElement('div');
    cubelet.className = 'cubelet';
    cubelet.style.transform = `
      rotateX(0deg)
      rotateY(0deg)
      rotateZ(0deg)
      translateX(${tX}px)
      translateY(${tY}px)
      translateZ(${tZ}px)
    `;

    for (let i in squares) {
      const params = squares[i];
      const square = document.createElement('div');
      square.className = `square square-${params.color} square-${colorMap[params.color].facing}`;
      square.style.transform = `
        rotateX(${colorMap[params.color].rX || 0}deg)
        rotateY(${colorMap[params.color].rY || 0}deg)
        rotateZ(${colorMap[params.color].rZ || 0}deg)
        translateX(${colorMap[params.color].tX || 0}px)
        translateY(${colorMap[params.color].tY || 0}px)
        translateZ(${colorMap[params.color].tZ || 0}px)
      `;

      cubelet.appendChild(square);
    }

    self.body.appendChild(cubelet);
  };

  const _getTransformValue = (transform) => {
    return {
      rX: parseInt(transform.match(/rotateX\((\-*\d+)deg\)/).pop()),
      rY: parseInt(transform.match(/rotateY\((\-*\d+)deg\)/).pop()),
      rZ: parseInt(transform.match(/rotateZ\((\-*\d+)deg\)/).pop())
    };
  };

})();