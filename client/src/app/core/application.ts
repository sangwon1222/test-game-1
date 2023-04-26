import * as PIXI from 'pixi.js';
import SceneManager from '@core/sceneManager';
import ModalManager from '@core/modalManager';
import config from '../config';
import Scene from './scene';

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

  get getScene(): Scene {
    return this.mSceneManager.currentScene;
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
    console.log(
      '%c LSW!!',
      'font-weight: bold; font-size: 50px;color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)'
    );
    this.stage.removeChildren();
    this.mSceneManager = new SceneManager();
    this.mModalManager = new ModalManager();
    this.stage.sortableChildren = true;
    this.mSceneManager.zIndex = 1;
    this.mModalManager.zIndex = 2;

    this.stage.addChild(this.mSceneManager, this.mModalManager);

    await this.mSceneManager.init();
    await this.mModalManager.init();
    await this.mSceneManager.startGame();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // 다른 탭으로 전환했을 때,
        this.onHiddenTab();
      } else {
        // 다른 탭 보다가 돌아왔을 때,
        this.onViewTab();
      }
    });
  }

  onHiddenTab() {
    //
  }
  onViewTab() {
    //
  }
}
