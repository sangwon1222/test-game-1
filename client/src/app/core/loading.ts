import * as PIXI from 'pixi.js';

export default class Loading extends PIXI.Container {
  private mLoadingDots: Array<PIXI.Graphics>;
  constructor() {
    super();
    this.mLoadingDots = [];
  }
  async makeLoadingDots() {
    const color = ['#0BA8E0', '#63FAB3', '#B98EF0'];
    for (let i = 0; i < color.length; i++) {
      const dot = new PIXI.Graphics();
      dot.beginFill(0, 1);
      dot.drawRect(0, 0, 20, 20);
      dot.endFill();
      this.addChild(dot);

      dot.pivot.set(-10, -10);
      dot.position.set();
    }
  }
}
