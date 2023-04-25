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

  get currentSceneInfo() {
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
    this.sceneAry.push(new BomBerScene(0, 'bomber'));
  }
  async startGame() {
    await this.changeScene('bomber');
  }

  async changeScene(goSceneName: string) {
    this.removeChildren();
    await Application.getHandle.getModalManager.loadingStart();
    this.sceneAry[this.sceneIdx]?.endGame();
    for (let i = 0; i < this.sceneAry.length; i++) {
      const { sceneName } = this.sceneAry[i].sceneInfo;
      if (goSceneName === sceneName) {
        this.addChild(this.sceneAry[i]);
        await this.sceneAry[i].startGame();
        await Application.getHandle.getModalManager.loadingEnd();
        break;
      }
    }
  }
}
