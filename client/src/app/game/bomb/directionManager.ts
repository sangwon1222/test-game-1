interface DirectionType {
  [key: string]: boolean;
}

export class DirectionManager {
  private mSpace: boolean;
  private mDirection: DirectionType;

  static _handle: DirectionManager;
  static get getHandle() {
    return DirectionManager._handle
      ? DirectionManager._handle
      : new DirectionManager();
  }
  get direction() {
    return this.mDirection;
  }
  get onSpace() {
    return this.mSpace;
  }

  constructor() {
    this.mDirection = {
      wait: true,
      up: false,
      down: false,
      left: false,
      right: false,
    };
    this.mSpace = false;

    DirectionManager._handle = this;

    document.onkeydown = (e) => {
      this.onkeydown(e);
    };
    document.onkeyup = (e) => {
      this.onkeyup(e);
    };
  }

  onkeyup(e: KeyboardEvent) {
    switch (e.key) {
      case 'w':
        this.mDirection.up = false;
        break;
      case 's':
        this.mDirection.down = false;
        break;
      case 'a':
        this.mDirection.left = false;
        break;
      case 'd':
        this.mDirection.right = false;
        break;
      case ' ':
        this.mSpace = false;
        break;
    }
  }

  onkeydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'w':
        this.mDirection.up = true;
        break;
      case 's':
        this.mDirection.down = true;
        break;
      case 'a':
        this.mDirection.left = true;
        break;
      case 'd':
        this.mDirection.right = true;
        break;
      case ' ':
        this.mSpace = true;
        break;
    }
  }

  updateDirection() {
    this.mDirection.wait =
      !this.mDirection.up &&
      !this.mDirection.down &&
      !this.mDirection.left &&
      !this.mDirection.right;
  }

  resetDirection() {
    this.mDirection = {
      wait: false,
      up: false,
      down: false,
      left: false,
      right: false,
    };
  }
}
