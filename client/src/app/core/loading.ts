import * as PIXI from 'pixi.js';
import Application from './application';
import { gsap } from 'gsap';
import config from '../canvasConfig';

const half = { x: config.width / 2, y: config.height / 2 };
const gap = 100;

export default class Loading extends PIXI.Container {
  private mLoadingDots: Array<PIXI.Graphics>;
  private mLoadingBg: PIXI.Graphics;
  constructor() {
    super();
    this.mLoadingDots = [];
    this.mLoadingBg = new PIXI.Graphics();
    this.mLoadingBg.beginFill(0x0000, 1);
    this.mLoadingBg.drawRect(0, 0, config.width, config.height);
    this.mLoadingBg.endFill();
    this.addChild(this.mLoadingBg);
  }

  async start() {
    gsap.to(this, {
      alpha: 1,
      duration: 0.5,
      onComplete: () => {
        let delay = 0;
        for (const dot of this.mLoadingDots) {
          delay += 0.5;
          const timeline = gsap.timeline();
          timeline.to(dot, { y: dot.y - gap, duration: 0.5 });
          timeline.to(dot, { x: dot.x - gap, duration: 0.5 });
          timeline.to(dot, { y: dot.y, duration: 0.5 });
          timeline.to(dot, { x: dot.x, duration: 0.5 });
          timeline.repeat(-1).delay(delay);
        }
      },
    });
  }

  async end() {
    gsap.to(this, {
      alpha: 0,
      duration: 0.25,
      onComplete: () => {
        const currentScene = Application.getHandle.getScene.sceneInfo.sceneName;
        console.log(
          `%c complete-loading [${currentScene}]`,
          'padding:10px; background: #000;color:#fff'
        );
      },
    });
  }

  async init() {
    const color = ['#0BA8E0', '#63FAB3', '#B98EF0'];

    for (let i = 0; i < color.length; i++) {
      const dot = new PIXI.Graphics();
      dot.beginFill(color[i], 1);
      dot.drawCircle(0, 0, 10);
      dot.endFill();

      dot.position.set(half.x - gap + i * gap, half.y);
      this.mLoadingDots.push(dot);
      this.addChild(dot);
    }
  }
}
