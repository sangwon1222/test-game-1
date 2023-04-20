import * as PIXI from 'pixi.js';
import SceneManager from '@core/sceneManager';

export default class application extends PIXI.Application {
  private sceneManager: SceneManager;
  private modalManager: PIXI.Container;
  constructor({
    width,
    height,
    backgroundColor,
  }: {
    width: number;
    height: number;
    backgroundColor: number;
  }) {
    super({
      width,
      height,
      backgroundColor,
    });
    this.sceneManager = new SceneManager();
    this.modalManager = new PIXI.Container();
  }

  async init() {
    this.stage.removeChildren();
    this.sceneManager = new SceneManager();
    this.modalManager = new PIXI.Container();
    this.stage.sortableChildren = true;
    this.sceneManager.zIndex = 1;
    this.modalManager.zIndex = 2;

    await this.sceneManager.init();
    await this.sceneManager.startGame();
  }
}
