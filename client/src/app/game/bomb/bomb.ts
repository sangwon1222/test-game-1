import { rscManager } from '@/app/core/rscManager';
import { AnimatedGIF } from '@pixi/gif';
import BomBerScene from './scene';
import util from '@game/common';
import * as PIXI from 'pixi.js';
import config from './config';
import { gsap } from 'gsap';

export class Bomb extends PIXI.Container {
  private mBomb: PIXI.Sprite;
  // private mBomb: AnimatedGIF;
  private mWaitBombSecond: number;
  private mFireArray: Array<PIXI.Sprite>;
  private mBombScope: number;
  private mGlobalPos: { x: number; y: number } = { x: 0, y: 0 };
  private mIsAlive: boolean;

  get isAlive() {
    return this.mIsAlive;
  }
  get globalPos() {
    return this.mGlobalPos;
  }
  set setGlobalPos({ x, y }: { x: number; y: number }) {
    this.mGlobalPos = { x, y };
  }
  constructor(scope = 1) {
    super();
    this.mWaitBombSecond = 3;
    this.mBombScope = scope;
    this.mIsAlive = false;

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

  async plantedBomb() {
    const metrix = util.getMetrixPos(this.globalPos.x, this.globalPos.y);

    if (config.mapData[metrix.y][metrix.x] === 1) return;
    config.mapData[metrix.y][metrix.x] = 1;

    this.mIsAlive = true;
    await this.createFireScope();
    await gsap.delayedCall(this.mWaitBombSecond, async () => {
      config.mapData[metrix.y][metrix.x] = 2;
      this.mIsAlive = false;
      (this.parent as BomBerScene).getMe.reduceBombCnt();
      console.log(config.mapData[metrix.y][metrix.x]);
      await this.bombFire();
      console.log(config.mapData[metrix.y][metrix.x]);
      config.mapData[metrix.y][metrix.x] = 0;
    });
  }

  async createFireScope() {
    this.fire(this.globalPos.x, this.globalPos.y);

    const direction = [
      [+1, 0],
      [-1, 0],
      [0, +1],
      [0, -1],
    ];
    for (let i = 0; i < 4; i++) {
      for (let j = 1; j <= this.mBombScope; j++) {
        let [x, y] = direction[i];
        if (x !== 0) x = x * j * config.tileScale;
        if (y !== 0) y = y * j * config.tileScale;

        this.fire(this.globalPos.x + x, this.globalPos.y + y);
      }
    }
  }

  async bombFire() {
    this.removeChildren();
    util.bombConsole('bomb');

    for (const fire of this.mFireArray) {
      gsap.to(fire.scale, { x: 1, y: 1, duration: 0.5 });
      gsap.to(fire, {
        alpha: 0,
        repeat: 3,
        duration: 0.5 / 3,
        yoyo: true,
        delay: 0.5,
        onComplete: () => {
          this.removeChildren();
          this.resetFire();
        },
      });
    }
  }

  fire(x: number, y: number) {
    const { tileScale } = config;
    const fire = new Fire(x + tileScale / 2, y + tileScale / 2);
    fire.position.set(x + tileScale / 2, y + tileScale / 2);
    this.mFireArray.push(fire);
    (this.parent.parent as BomBerScene).addChild(fire);
  }

  resetFire() {
    for (const fire of this.mFireArray) {
      const scene = this.parent.parent as BomBerScene;
      scene.removeChild(fire);
    }
    this.mFireArray = [];
  }
}

export class Fire extends PIXI.Sprite {
  constructor(globalx: number, globaly: number) {
    super();
    this.texture = rscManager.getHandle.getRsc(`fire-bomb.png`);
    this.anchor.set(0.5);
    this.position.set(config.tileScale, config.tileScale / 2);
    this.scale.set(0);
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
