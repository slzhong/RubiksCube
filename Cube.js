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
        if (face === 'x' || face === 'y' || face === 'z') {
          _moveCenters(this, face, step);
        } else {
          _moveFaces(this, face, step);
        }

        setTimeout(() => {
          this.moving = false;
        }, 320);
      }
    }

    shuffle() {
      const moves = ['front', 'back', 'up', 'down', 'left', 'right', 'x', 'y', 'z'];
      
      let count = 0;
      const iter = setInterval(() => {
        if (++count > 50) {
          clearInterval(iter);
        } else {
          const move = moves[Math.floor(Math.random() * moves.length)];
          const step = Math.random() * 2 > 1 ? 1 : -1;
          this.move(move, step);
          this.tmp = this.tmp || [];
          this.tmp.push({
            move: move,
            step: step
          });
        }
      }, 350);
    }

    reposition() {
      this.body.style.transform = `
        rotateX(-20deg) 
        rotateY(-30deg) 
        rotateZ(0deg)
        translateX(0px)
        translateY(0px)
        translateZ(0px)
      `;
    }

    solve() {
      if (this.tmp) {
        const iter = setInterval(() => {
          if (this.tmp.length <= 0) {
            clearInterval(iter);
          } else {
            const step = this.tmp.pop();
            this.move(step.move, -step.step);
          }
        }, 350);
      }
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
    },
    x: {
      centers: ['front', 'back', 'left', 'right'],
      edges: ['front-left', 'front-right', 'back-left', 'back-right'],
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
    y: {
      centers: ['front', 'back', 'up', 'down'],
      edges: ['front-up', 'front-down', 'back-up', 'back-down'],
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
    z: {
      centers: ['up', 'down', 'left', 'right'],
      edges: ['up-left', 'up-right', 'down-left', 'down-right'],
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
    }
  };

  const _initBody = (self) => {
    self.body = document.querySelector('#cube');
    self.body.innerHTML = '';
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
      facing: 'front',
      type: 'center'
    }]);

    _initCubelet(self, 0, 0, -100, [{
      color: 'yellow',
      facing: 'back',
      type: 'center'
    }]);

    _initCubelet(self, 0, -100, 0, [{
      color: 'red',
      facing: 'up',
      type: 'center'
    }]);

    _initCubelet(self, 0, 100, 0, [{
      color: 'orange',
      facing: 'down',
      type: 'center'
    }]);

    _initCubelet(self, 100, 0, 0, [{
      color: 'green',
      facing: 'right',
      type: 'center'
    }]);

    _initCubelet(self, -100, 0, 0, [{
      color: 'blue',
      facing: 'left',
      type: 'center'
    }]);
  };

  const _initEdgeCubelets = (self) => {
    _initCubelet(self, -100, 0, 100, [{
      color: 'blue',
      facing: 'left',
      type: 'edge'
    }, {
      color: 'white',
      facing: 'front',
      type: 'edge'
    }]);

    _initCubelet(self, 0, -100, 100, [{
      color: 'red',
      facing: 'up',
      type: 'edge'
    }, {
      color: 'white',
      facing: 'front',
      type: 'edge'
    }]);

    _initCubelet(self, 100, 0, 100, [{
      color: 'green',
      facing: 'right',
      type: 'edge'
    }, {
      color: 'white',
      facing: 'front',
      type: 'edge'
    }]);

    _initCubelet(self, 0, 100, 100, [{
      color: 'orange',
      facing: 'down',
      type: 'edge'
    }, {
      color: 'white',
      facing: 'front',
      type: 'edge'
    }]);

    _initCubelet(self, -100, 0, -100, [{
      color: 'blue',
      facing: 'left',
      type: 'edge'
    }, {
      color: 'yellow',
      facing: 'back',
      type: 'edge'
    }]);

    _initCubelet(self, 100, 0, -100, [{
      color: 'green',
      facing: 'right',
      type: 'edge'
    }, {
      color: 'yellow',
      facing: 'back',
      type: 'edge'
    }]);

    _initCubelet(self, 0, -100, -100, [{
      color: 'red',
      facing: 'up',
      type: 'edge'
    }, {
      color: 'yellow',
      facing: 'back',
      type: 'edge'
    }]);

    _initCubelet(self, 0, 100, -100, [{
      color: 'orange',
      facing: 'down',
      type: 'edge'
    }, {
      color: 'yellow',
      facing: 'back',
      type: 'edge'
    }]);

    _initCubelet(self, -100, -100, 0, [{
      color: 'blue',
      facing: 'left',
      type: 'edge'
    }, {
      color: 'red',
      facing: 'up',
      type: 'edge'
    }]);

    _initCubelet(self, -100, 100, 0, [{
      color: 'blue',
      facing: 'left',
      type: 'edge'
    }, {
      color: 'orange',
      facing: 'down',
      type: 'edge'
    }]);

    _initCubelet(self, 100, -100, 0, [{
      color: 'green',
      facing: 'right',
      type: 'edge'
    }, {
      color: 'red',
      facing: 'up',
      type: 'edge'
    }]);

    _initCubelet(self, 100, 100, 0, [{
      color: 'green',
      facing: 'right',
      type: 'edge'
    }, {
      color: 'orange',
      facing: 'down',
      type: 'edge'
    }]);
  };

  const _initCornerCubeletes = (self) => {
    _initCubelet(self, -100, -100, 100, [{
      color: 'red',
      facing: 'up',
      type: 'corner'
    }, {
      color: 'blue',
      facing: 'left',
      type: 'corner'
    }, {
      color: 'white',
      facing: 'front',
      type: 'corner'
    }]);

    _initCubelet(self, 100, -100, 100, [{
      color: 'red',
      facing: 'up',
      type: 'corner'
    }, {
      color: 'green',
      facing: 'right',
      type: 'corner'
    }, {
      color: 'white',
      facing: 'front',
      type: 'corner'
    }]);

    _initCubelet(self, -100, 100, 100, [{
      color: 'orange',
      facing: 'down',
      type: 'corner'
    }, {
      color: 'blue',
      facing: 'left',
      type: 'corner'
    }, {
      color: 'white',
      facing: 'front',
      type: 'corner'
    }]);

    _initCubelet(self, 100, 100, 100, [{
      color: 'orange',
      facing: 'down',
      type: 'corner'
    }, {
      color: 'green',
      facing: 'right',
      type: 'corner'
    }, {
      color: 'white',
      facing: 'front',
      type: 'corner'
    }]);

    _initCubelet(self, -100, -100, -100, [{
      color: 'red',
      facing: 'up',
      type: 'corner'
    }, {
      color: 'blue',
      facing: 'left',
      type: 'corner'
    }, {
      color: 'yellow',
      facing: 'back',
      type: 'corner'
    }]);

    _initCubelet(self, 100, -100, -100, [{
      color: 'red',
      facing: 'up',
      type: 'corner'
    }, {
      color: 'green',
      facing: 'right',
      type: 'corner'
    }, {
      color: 'yellow',
      facing: 'back',
      type: 'corner'
    }]);

    _initCubelet(self, -100, 100, -100, [{
      color: 'orange',
      facing: 'down',
      type: 'corner'
    }, {
      color: 'blue',
      facing: 'left',
      type: 'corner'
    }, {
      color: 'yellow',
      facing: 'back',
      type: 'corner'
    }]);

    _initCubelet(self, 100, 100, -100, [{
      color: 'orange',
      facing: 'down',
      type: 'corner'
    }, {
      color: 'green',
      facing: 'right',
      type: 'corner'
    }, {
      color: 'yellow',
      facing: 'back',
      type: 'corner'
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
      square.className = `square square-${params.color}`;
      square.setAttribute('data-color', params.color);
      square.setAttribute('data-facing', params.facing);
      square.setAttribute('data-type', params.type);
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
    let childrenTypes = [];
    for (let i = 0; i < children.length; i++) {
      childrenColors.push(children[i].getAttribute('data-color'));
      childrenFacings.push(children[i].getAttribute('data-facing'));
      childrenTypes.push(children[i].getAttribute('data-type'));
    }

    let tX = childrenFacings.indexOf('left') > -1 ? -100 : childrenFacings.indexOf('right') > -1 ? 100 : 0;
    let tY = childrenFacings.indexOf('up') > -1 ? -100 : childrenFacings.indexOf('down') > -1 ? 100 : 0;
    let tZ = childrenFacings.indexOf('front') > -1 ? 100 : childrenFacings.indexOf('back') > -1 ? -100 : 0;

    let childrenParams = [];
    for (let i = 0; i < childrenColors.length; i++) {
      childrenParams.push({
        color: childrenColors[i],
        facing: childrenFacings[i],
        type: childrenTypes[i]
      });
    }

    self.body.removeChild(cubelet);
    _initCubelet(self, tX, tY, tZ, childrenParams);
  };

  const _moveFaces = (self, face, step) => {
    const faces = document.querySelectorAll(`.square[data-facing="${face}"]`);
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
        const current = siblings[j].getAttribute('data-facing');
        if (current !== face) {
          siblings[j].setAttribute('data-facing', step > 0 ? MOVE_MAP[face].swap[current] : MOVE_MAP[face].swapReverse[current]);
        }
      }

      setTimeout(() => {
        _reinitCubelet(self, faces[i].parentNode);
      }, 310);
    }
  };

  const _moveCenters = (self, face, step) => {
    let cubelets = [];
    for (let i = 0; i < self.body.childNodes.length; i++) {
      let cubelet = self.body.childNodes[i];
      if (cubelet.childNodes.length === 1 && MOVE_MAP[face].centers.indexOf(cubelet.childNodes[0].getAttribute('data-facing')) > -1) {
        cubelets.push(cubelet);
      } else if (cubelet.childNodes.length === 2) {
        const facingA = cubelet.childNodes[0].getAttribute('data-facing');
        const facingB = cubelet.childNodes[1].getAttribute('data-facing');
        if (MOVE_MAP[face].edges.indexOf(`${facingA}-${facingB}`) > -1 ||
            MOVE_MAP[face].edges.indexOf(`${facingB}-${facingA}`) > -1 ) {
          cubelets.push(cubelet);
        }
      }
    }

    for (let i = 0; i < cubelets.length; i++) {
      const triple = _getTransformValue(cubelets[i].style.transform);
      cubelets[i].style.transform = `
        rotateX(${(MOVE_MAP[face].rX || 0) * step + triple.rX}deg)
        rotateY(${(MOVE_MAP[face].rY || 0) * step + triple.rY}deg)
        rotateZ(${(MOVE_MAP[face].rZ || 0) * step + triple.rZ}deg)
        translateX(${triple.tX}px)
        translateY(${triple.tY}px)
        translateZ(${triple.tZ}px)
      `;

      const children = cubelets[i].childNodes;
      for (let j = 0; j < children.length; j++) {
        const current = children[j].getAttribute('data-facing');
        if (current !== face) {
          children[j].setAttribute('data-facing', step > 0 ? MOVE_MAP[face].swap[current] : MOVE_MAP[face].swapReverse[current]);
        }
      }

      setTimeout(() => {
        _reinitCubelet(self, cubelets[i]);
      }, 310);
    }
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