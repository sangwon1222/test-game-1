import { rscManager } from '@/app/core/rscManager';
import BomBerScene from './scene';
import * as PIXI from 'pixi.js';
import config from './config';
import { gsap } from 'gsap';
import Application from '@/app/core/application';

export class Bomb extends PIXI.Container {
  private mBomb: PIXI.Sprite;
  private mWaitBombSecond: number;
  private mFireArray: Array<PIXI.Sprite>;
  private mBombScope: number;

  private get scene() {
    return Application.getHandle.getScene as BomBerScene;
  }
  get bombScope() {
    return this.mBombScope;
  }
  get waitBomb() {
    return this.mWaitBombSecond;
  }

  constructor(scope = 1) {
    super();
    this.mWaitBombSecond = 3;
    this.mBombScope = scope;

    this.mBomb = new PIXI.Sprite(rscManager.getHandle.getRsc(`bomb.png`));
    this.mBomb.anchor.set(0.5);
    this.mBomb.position.set(config.tileScale / 2, config.tileScale / 2);
    gsap
      .to(this.mBomb.scale, { x: 0.8, y: 0.8, duration: 0.2 })
      .repeat(-1)
      .yoyo(true);
    this.mFireArray = [];

    this.removeChildren();
    this.addChild(this.mBomb);
  }
}

export class Fire extends PIXI.Container {
  private mFire: PIXI.Sprite;
  constructor() {
    super();
    this.mFire = new PIXI.Sprite();
    this.mFire.texture = rscManager.getHandle.getRsc(`fire-bomb.png`);
    this.mFire.position.set(config.tileScale / 2, config.tileScale / 2);
    this.mFire.anchor.set(0.5, 0.5);
    this.mFire.scale.set(0);
    gsap.to(this.mFire.scale, { x: 1, y: 1, duration: 0.5 });
    gsap
      .to(this.mFire, { alpha: 0, duration: 0.4 / 6 })
      .delay(0.6)
      .repeat(7)
      .yoyo(true)
      .eventCallback('onComplete', () => {
        this.emit('endFire' as keyof PIXI.DisplayObjectEvents);
      });
    this.addChild(this.mFire);
  }
}

export class PlatBomb extends PIXI.Sprite {
  constructor() {
    super();
    this.texture = rscManager.getHandle.getRsc(`bomb.png`);
    this.anchor.set(0.5);
    this.position.set(config.tileScale, config.tileScale / 2);
    this.scale.set(0.6);
  }
}
