import gsap from 'gsap';
import * as PIXI from 'pixi.js';

export default class Scene extends PIXI.Container {
  private info: { idx: number; sceneName: string };
  private isUseKeyboard: boolean;

  set useKeyboard(value: boolean) {
    this.isUseKeyboard = value;
  }

  get useKeyboard() {
    return this.isUseKeyboard;
  }

  get sceneInfo() {
    return this.info;
  }
  constructor(idx: number, sceneName: string) {
    super();
    this.isUseKeyboard = false;
    this.info = { idx, sceneName };
  }

  /**
   * @description scene을 상속받는 각 scene에서 호출
   */
  async startGame() {
    // console.log(`${this.info.sceneName}-start!`);
  }

  /**
   * @description scene을 상속받는 각 scene에서 호출
   */
  async endGame() {
    // console.log(`${this.info.sceneName}-end!`);
    gsap.globalTimeline.clear();
    this.removeChildren();
  }

  async keyupEvent(e: KeyboardEvent) {
    //
  }

  async keydownEvent(e: KeyboardEvent) {
    //
  }
}
