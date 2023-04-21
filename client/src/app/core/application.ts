import * as PIXI from 'pixi.js';
import SceneManager from '@core/sceneManager';
import ModalManager from '@core/modalManager';
import config from '../config';

const params = {
  backgroundColor: config.background,
  width: config.width,
  height: config.height,
};

export default class Application extends PIXI.Application {
  private static handle: Application;
  static get getHandle(): Application {
    return Application.handle ? Application.handle : new Application(params);
  }

  get getSceneManager(): SceneManager {
    return this.mSceneManager;
  }
  get getModalManager(): ModalManager {
    return this.mModalManager;
  }

  private mSceneManager: SceneManager;
  private mModalManager: ModalManager;
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
    Application.handle = this;
    this.mSceneManager = new SceneManager();
    this.mModalManager = new ModalManager();
  }

  async init() {
    this.stage.removeChildren();
    this.mSceneManager = new SceneManager();
    this.mModalManager = new ModalManager();
    this.stage.sortableChildren = true;
    this.mSceneManager.zIndex = 1;
    this.mModalManager.zIndex = 2;

    this.stage.addChild(this.mSceneManager, this.mModalManager);

    await this.mModalManager.init();
    await this.mSceneManager.init();
    await this.mSceneManager.startGame();
  }
}
