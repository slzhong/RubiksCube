(() => {

  class Cube {

    constructor() {
      _initBody(this);
    }

    rotate(x, y, z) {
      let transform = this.body.style.transform || 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
      let triple = _getTransformValue(transform, false);
      this.body.style.transform = `
        rotateX(${triple.rX + x}deg) 
        rotateY(${triple.rY + y}deg) 
        rotateZ(${triple.rZ + z}deg)
        translateX(${triple.tX}px)
        translateY(${triple.tY}px)
        translateZ(${triple.tZ}px)
      `;
    }

    move(face, step) {
      if (!this.moving) {
        this.moving = true;
        const faces = document.querySelectorAll(`.square-${face}`);
        for (let i = 0; i < faces.length; i++) {
          const triple = _getTransformValue(faces[i].parentNode.style.transform);
          faces[i].parentNode.style.transform = `
            rotateX(${(MOVE_MAP[face].rX || 0) * step + triple.rX}deg)
            rotateY(${(MOVE_MAP[face].rY || 0) * step + triple.rY}deg)
            rotateZ(${(MOVE_MAP[face].rZ || 0) * step + triple.rZ}deg)
            translateX(${triple.tX}px)
            translateY(${triple.tY}px)
            translateZ(${triple.tZ}px)
          `;

          const siblings = faces[i].parentNode.childNodes;
          for (let j = 0; j < siblings.length; j++) {
            const current = siblings[j].className.split('-').pop();
            if (current !== face) {
              siblings[j].classList.remove(`square-${current}`);
              siblings[j].classList.add(`square-${step > 0 ? MOVE_MAP[face].swap[current] : MOVE_MAP[face].swapReverse[current]}`);
            }
          }

          setTimeout(() => {
            _reinitCubelet(this, faces[i].parentNode);
          }, 310);
        }

        setTimeout(() => {
          this.moving = false;
        }, 320);
      }
    }

    shuffle() {
      const moves = ['front', 'back', 'up', 'down', 'left', 'right'];
      
      let count = 0;
      const iter = setInterval(() => {
        if (++count > 50) {
          clearInterval(iter);
        } else {
          this.move(moves[Math.floor(Math.random() * moves.length)], Math.random() * 2 > 1 ? 1 : -1);
        }
      }, 350);
    }

  };

  window.Cube = Cube;

  const MOVE_MAP = {
    front: {
      rZ: 90,
      swap: {
        up: 'right',
        down: 'left',
        left: 'up',
        right: 'down'
      },
      swapReverse: {
        up: 'left',
        down: 'right',
        left: 'down',
        right: 'up'
      }
    },
    back: {
      rZ: 90,
      swap: {
        up: 'right',
        down: 'left',
        left: 'up',
        right: 'down'
      },
      swapReverse: {
        up: 'left',
        down: 'right',
        left: 'down',
        right: 'up'
      }
    },
    left: {
      rX: -90,
      swap: {
        up: 'front',
        down: 'back',
        front: 'down',
        back: 'up'
      },
      swapReverse: {
        up: 'back',
        down: 'front',
        front: 'up',
        back: 'down'
      }
    },
    right: {
      rX: 90,
      swap: {
        up: 'back',
        down: 'front',
        front: 'up',
        back: 'down'
      },
      swapReverse: {
        up: 'front',
        down: 'back',
        front: 'down',
        back: 'up'
      }
    },
    up: {
      rY: -90,
      swap: {
        front: 'left',
        back: 'right',
        left: 'back',
        right: 'front'
      },
      swapReverse: {
        front: 'right',
        back: 'left',
        left: 'front',
        right: 'back'
      }
    },
    down: {
      rY: 90,
      swap: {
        front: 'right',
        back: 'left',
        left: 'front',
        right: 'back'
      },
      swapReverse: {
        front: 'left',
        back: 'right',
        left: 'back',
        right: 'front'
      }
    }
  };

  const _initBody = (self) => {
    self.body = document.querySelector('#cube');
    self.body.style.transform = `
      rotateX(-20deg) 
      rotateY(-30deg) 
      rotateZ(0deg)
      translateX(0px)
      translateY(0px)
      translateZ(0px)
    `;

    _initCenterCubelets(self);
    _initEdgeCubelets(self);
    _initCornerCubeletes(self);
  };

  const _initCenterCubelets = (self) => {
    _initCubelet(self, 0, 0, 100, [{
      color: 'white',
      facing: 'front'
    }]);

    _initCubelet(self, 0, 0, -100, [{
      color: 'yellow',
      facing: 'back'
    }]);

    _initCubelet(self, 0, -100, 0, [{
      color: 'red',
      facing: 'up'
    }]);

    _initCubelet(self, 0, 100, 0, [{
      color: 'orange',
      facing: 'down'
    }]);

    _initCubelet(self, 100, 0, 0, [{
      color: 'green',
      facing: 'right'
    }]);

    _initCubelet(self, -100, 0, 0, [{
      color: 'blue',
      facing: 'left'
    }]);
  };

  const _initEdgeCubelets = (self) => {
    _initCubelet(self, -100, 0, 100, [{
      color: 'blue',
      facing: 'left'
    }, {
      color: 'white',
      facing: 'front'
    }]);

    _initCubelet(self, 0, -100, 100, [{
      color: 'red',
      facing: 'up'
    }, {
      color: 'white',
      facing: 'front'
    }]);

    _initCubelet(self, 100, 0, 100, [{
      color: 'green',
      facing: 'right'
    }, {
      color: 'white',
      facing: 'front'
    }]);

    _initCubelet(self, 0, 100, 100, [{
      color: 'orange',
      facing: 'down'
    }, {
      color: 'white',
      facing: 'front'
    }]);

    _initCubelet(self, -100, 0, -100, [{
      color: 'blue',
      facing: 'left'
    }, {
      color: 'yellow',
      facing: 'back'
    }]);

    _initCubelet(self, 100, 0, -100, [{
      color: 'green',
      facing: 'right'
    }, {
      color: 'yellow',
      facing: 'back'
    }]);

    _initCubelet(self, 0, -100, -100, [{
      color: 'red',
      facing: 'up'
    }, {
      color: 'yellow',
      facing: 'back'
    }]);

    _initCubelet(self, 0, 100, -100, [{
      color: 'orange',
      facing: 'down'
    }, {
      color: 'yellow',
      facing: 'back'
    }]);

    _initCubelet(self, -100, -100, 0, [{
      color: 'blue',
      facing: 'left'
    }, {
      color: 'red',
      facing: 'up'
    }]);

    _initCubelet(self, -100, 100, 0, [{
      color: 'blue',
      facing: 'left'
    }, {
      color: 'orange',
      facing: 'down'
    }]);

    _initCubelet(self, 100, -100, 0, [{
      color: 'green',
      facing: 'right'
    }, {
      color: 'red',
      facing: 'up'
    }]);

    _initCubelet(self, 100, 100, 0, [{
      color: 'green',
      facing: 'right'
    }, {
      color: 'orange',
      facing: 'down'
    }]);
  };

  const _initCornerCubeletes = (self) => {
    _initCubelet(self, -100, -100, 100, [{
      color: 'red',
      facing: 'up'
    }, {
      color: 'blue',
      facing: 'left'
    }, {
      color: 'white',
      facing: 'front'
    }]);

    _initCubelet(self, 100, -100, 100, [{
      color: 'red',
      facing: 'up'
    }, {
      color: 'green',
      facing: 'right'
    }, {
      color: 'white',
      facing: 'front'
    }]);

    _initCubelet(self, -100, 100, 100, [{
      color: 'orange',
      facing: 'down'
    }, {
      color: 'blue',
      facing: 'left'
    }, {
      color: 'white',
      facing: 'front'
    }]);

    _initCubelet(self, 100, 100, 100, [{
      color: 'orange',
      facing: 'down'
    }, {
      color: 'green',
      facing: 'right'
    }, {
      color: 'white',
      facing: 'front'
    }]);

    _initCubelet(self, -100, -100, -100, [{
      color: 'red',
      facing: 'up'
    }, {
      color: 'blue',
      facing: 'left'
    }, {
      color: 'yellow',
      facing: 'back'
    }]);

    _initCubelet(self, 100, -100, -100, [{
      color: 'red',
      facing: 'up'
    }, {
      color: 'green',
      facing: 'right'
    }, {
      color: 'yellow',
      facing: 'back'
    }]);

    _initCubelet(self, -100, 100, -100, [{
      color: 'orange',
      facing: 'down'
    }, {
      color: 'blue',
      facing: 'left'
    }, {
      color: 'yellow',
      facing: 'back'
    }]);

    _initCubelet(self, 100, 100, -100, [{
      color: 'orange',
      facing: 'down'
    }, {
      color: 'green',
      facing: 'right'
    }, {
      color: 'yellow',
      facing: 'back'
    }]);
  };

  const _initCubelet = (self, tX, tY, tZ, squares) => {
    const facingMap = {
      front: {
        tZ: 50
      },
      back: {
        tZ: -50
      },
      up: {
        rX: 90,
        tZ: 50
      },
      down: {
        rX: 90,
        tZ: -50
      },
      left: {
        rY: 90,
        tZ: -50
      },
      right: {
        rY: 90,
        tZ: 50
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
      square.className = `square square-${params.color} square-${params.facing}`;
      square.style.transform = `
        rotateX(${facingMap[params.facing].rX || 0}deg)
        rotateY(${facingMap[params.facing].rY || 0}deg)
        rotateZ(${facingMap[params.facing].rZ || 0}deg)
        translateX(${facingMap[params.facing].tX || 0}px)
        translateY(${facingMap[params.facing].tY || 0}px)
        translateZ(${facingMap[params.facing].tZ || 0}px)
      `;

      cubelet.appendChild(square);
    }

    self.body.appendChild(cubelet);
  };

  const _reinitCubelet = (self, cubelet) => {
    const children = cubelet.childNodes;
    let childrenColors = [];
    let childrenFacings = [];
    for (let i = 0; i < children.length; i++) {
      const classList = children[i].classList;
      childrenColors.push(classList[1].split('-').pop());
      childrenFacings.push(classList[2].split('-').pop());
    }

    let tX = childrenFacings.indexOf('left') > -1 ? -100 : childrenFacings.indexOf('right') > -1 ? 100 : 0;
    let tY = childrenFacings.indexOf('up') > -1 ? -100 : childrenFacings.indexOf('down') > -1 ? 100 : 0;
    let tZ = childrenFacings.indexOf('front') > -1 ? 100 : childrenFacings.indexOf('back') > -1 ? -100 : 0;

    let childrenParams = [];
    for (let i = 0; i < childrenColors.length; i++) {
      childrenParams.push({
        color: childrenColors[i],
        facing: childrenFacings[i]
      });
    }

    self.body.removeChild(cubelet);
    _initCubelet(self, tX, tY, tZ, childrenParams);
  };

  const _getTransformValue = (transform) => {
    return {
      rX: parseInt(transform.match(/rotateX\((\-*\d+)deg\)/).pop()),
      rY: parseInt(transform.match(/rotateY\((\-*\d+)deg\)/).pop()),
      rZ: parseInt(transform.match(/rotateZ\((\-*\d+)deg\)/).pop()),
      tX: parseInt(transform.match(/translateX\((\-*\d+)px\)/).pop()),
      tY: parseInt(transform.match(/translateY\((\-*\d+)px\)/).pop()),
      tZ: parseInt(transform.match(/translateZ\((\-*\d+)px\)/).pop())
    };
  };

})();