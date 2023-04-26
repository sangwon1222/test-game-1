import Application from '@core/application';

interface DirectionType {
  [key: string]: boolean;
}

export class DirectionManager {
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

  constructor() {
    this.mDirection = {
      wait: true,
      up: false,
      down: false,
      left: false,
      right: false,
    };

    DirectionManager._handle = this;

    const directionKeys = ['w', 'ㅈ', 's', 'ㄴ', 'a', 'ㅁ', 'd', 'ㅇ'];

    document.onkeydown = (e) => {
      if (directionKeys.includes(e.key)) {
        this.onkeydown(e);
        return;
      }

      const scene = Application.getHandle.getScene;
      if (scene.useKeyboard) scene.keydownEvent(e);
    };
    document.onkeyup = (e) => {
      if (directionKeys.includes(e.key)) {
        this.onkeyup(e);
        return;
      }

      const scene = Application.getHandle.getScene;
      if (scene.useKeyboard) scene.keyupEvent(e);
    };
  }

  onkeyup(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    if (key === 'w' || key === 'ㅈ') this.mDirection.up = false;
    if (key === 's' || key === 'ㄴ') this.mDirection.down = false;
    if (key === 'a' || key === 'ㅁ') this.mDirection.left = false;
    if (key === 'd' || key === 'ㅇ') this.mDirection.right = false;
  }

  onkeydown(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    if (key === 'w' || key === 'ㅈ') this.mDirection.up = true;
    if (key === 's' || key === 'ㄴ') this.mDirection.down = true;
    if (key === 'a' || key === 'ㅁ') this.mDirection.left = true;
    if (key === 'd' || key === 'ㅇ') this.mDirection.right = true;
  }

  updateDirection() {
    this.mDirection.wait =
      !this.mDirection.up &&
      !this.mDirection.down &&
      !this.mDirection.left &&
      !this.mDirection.right;
  }
}
