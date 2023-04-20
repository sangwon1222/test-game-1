import * as PIXI from 'pixi.js';

export default class Scene extends PIXI.Container {
  private info: { idx: number; sceneName: string };
  get sceneInfo() {
    return this.info;
  }
  constructor(idx: number, sceneName: string) {
    super();
    this.info = { idx, sceneName };
  }

  async start() {
    console.log('scene!!');
  }
}
