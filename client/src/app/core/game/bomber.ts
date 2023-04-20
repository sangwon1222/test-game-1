import * as PIXI from 'pixi.js';
import Scene from '../scene';

export default class BomBer extends Scene {
  constructor(idx: number, sceneName: string) {
    super(idx, sceneName);
    console.log(this.sceneInfo);
  }

  async start() {
    console.log('bomber!!');
    await this.loading();
  }

  async loading() {
    //
  }
}
