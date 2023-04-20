import * as PIXI from 'pixi.js';
import Scene from '@core/scene';
import BomBer from '@/app/core/game/bomber';

export default class SceneManager extends PIXI.Container {
  private sceneAry: Array<Scene>;
  private sceneIdx: number;

  get currentScene() {
    return this.sceneAry[this.sceneIdx].sceneInfo;
  }

  constructor() {
    super();
    this.sceneAry = [];
    this.sceneIdx = 0;
  }

  async init() {
    this.sceneIdx = 0;
    this.sceneAry = [];
    this.sceneAry.push(new BomBer(0, 'bomber'));
  }
  async startGame() {
    await this.sceneAry[this.sceneIdx].start();
  }
}
