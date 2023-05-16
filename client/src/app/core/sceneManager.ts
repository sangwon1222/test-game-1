import * as PIXI from 'pixi.js';
import Scene from '@core/scene';
import BomBerScene from '@/app/game/bomb/scene';
import Application from './application';

export default class SceneManager extends PIXI.Container {
  private sceneAry: Array<Scene>;
  private sceneIdx: number;

  get currentScene() {
    return this.sceneAry[this.sceneIdx];
  }

  constructor() {
    super();

    this.sceneAry = [];
    this.sceneIdx = 0;
  }

  async init() {
    this.sceneIdx = 0;
    this.sceneAry = [];
    this.sceneAry.push(new BomBerScene(0, 'bomber'));
  }
  async start() {
    await this.changeScene('bomber');
  }

  async changeScene(goSceneName: string) {
    this.removeChildren();
    await this.sceneAry[this.sceneIdx]?.endGame();
    await Application.getHandle.getModalManager.loadingStart();
    for (let i = 0; i < this.sceneAry.length; i++) {
      const { sceneName } = this.sceneAry[i].sceneInfo;
      if (goSceneName === sceneName) {
        this.addChild(this.sceneAry[i]);
        await this.sceneAry[i].init();
        await this.sceneAry[i].startGame();
        await Application.getHandle.getModalManager.loadingEnd();
        break;
      }
    }
  }
}
