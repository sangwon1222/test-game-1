import * as PIXI from 'pixi.js';
import Application from './application';

export default class Loading extends PIXI.Container {
  private mLoadingDots: Array<PIXI.Graphics>;
  constructor() {
    super();
    this.mLoadingDots = [];
  }

  async start() {
    //
  }
  async end() {
    const currentScene = Application.getHandle.getScene.sceneInfo.sceneName;
    console.log(
      `%c complete-loading [${currentScene}]`,
      'padding:10px; background: #000;color:#fff'
    );
  }

  async init() {
    const color = ['#0BA8E0', '#63FAB3', '#B98EF0'];
    for (let i = 0; i < color.length; i++) {
      const dot = new PIXI.Graphics();
      dot.beginFill(0xffff, 1);
      dot.drawRect(0, 0, 20, 20);
      dot.endFill();

      dot.pivot.set(-10, -10);
      dot.position.set(300, 400);

      this.addChild(dot);
      this.mLoadingDots.push(dot);
    }
  }
}
