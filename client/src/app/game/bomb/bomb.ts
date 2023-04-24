import { rscManager } from '@/app/core/rscManager';
import { AnimatedGIF } from '@pixi/gif';
import * as PIXI from 'pixi.js';
import config from './config';

export class Bomb extends PIXI.Container {
  private mDisplayBomb: PIXI.Sprite | null = null;
  private mBomb: AnimatedGIF;
  private mBombed: PIXI.Texture | null = null;
  constructor() {
    super();
    this.mBomb = rscManager.getHandle.getRsc(`bomb.gif`);
    this.mDisplayBomb = new PIXI.Sprite();
    this.mDisplayBomb.anchor.set(0.5);
    this.mDisplayBomb.position.set(config.tileScale / 2, config.tileScale / 2);

    this.removeChildren();
    this.addChild(this.mBomb);
  }
}
