import { rscManager } from '@/app/core/rscManager';
import { AnimatedGIF } from '@pixi/gif';
import * as PIXI from 'pixi.js';
import { DirectionType, GifObjectType } from '../common/index';
import { Bomb } from './bomb';
import BomBerScene from './scene';
import config from './config';
import { gsap } from 'gsap';

export default class BomBer extends PIXI.Container {
  private mName: string;
  private mGifSprite: GifObjectType;
  private mStatus = 'wait';
  private mSetTimeOut: NodeJS.Timeout | null = null;
  private mBombArray: Array<Bomb>;
  private mAry = [];
  private isMoving = false;
  private mIsBombing: boolean;

  get bombArray() {
    return this.mBombArray;
  }

  constructor(name: string) {
    super();
    this.mName = name;
    this.mGifSprite = {};
    this.mBombArray = [];
    this.mIsBombing = false;
  }

  async init() {
    const name = this.mName;
    this.mGifSprite = {
      wait: rscManager.getHandle.getRsc(`${name}-wait.gif`) as AnimatedGIF,
      left: rscManager.getHandle.getRsc(`${name}-l.gif`) as AnimatedGIF,
      right: rscManager.getHandle.getRsc(`${name}-r.gif`) as AnimatedGIF,
      down: rscManager.getHandle.getRsc(`${name}-down.gif`) as AnimatedGIF,
      up: rscManager.getHandle.getRsc(`${name}-up.gif`) as AnimatedGIF,
      bomb: rscManager.getHandle.getRsc(`${name}-bombing.gif`) as AnimatedGIF,
    };
    this.mStatus = 'wait';
    this.chageStatus(this.mStatus);
    this.position.set(config.tileScale, config.tileScale);
  }

  chageStatus(status: string) {
    if (this.mSetTimeOut) {
      clearTimeout(this.mSetTimeOut);
      this.mSetTimeOut = null;
    }
    this.removeChildren();
    this.mStatus = status;
    this.addChild(this.mGifSprite[status]);
  }

  bomb() {
    this.chageStatus('bomb');
    this.mSetTimeOut = setTimeout(() => {
      if (this.mStatus === 'bomb') this.chageStatus('wait');
      this.mSetTimeOut = null;
    }, 500);

    console.log(this.mIsBombing);
    console.log(this.x, this.y);
    this.mIsBombing = true;
    if (this.mIsBombing) return;

    const bomb = new Bomb();
    const scene = this.parent as BomBerScene;
    bomb.position.set(this.x, this.y);
    scene.addChild(bomb);
    this.mBombArray.push(bomb);
    this.mIsBombing = false;
  }

  setDirection(direction: DirectionType) {
    if (direction.wait) {
      this.chageStatus('wait');
      this.isMoving = false;
    }

    if (this.isMoving) return;
    this.isMoving =
      direction.up || direction.down || direction.left || direction.right;

    if (direction.up) {
      this.chageStatus('up');
      this.move({ y: this.y - config.tileScale });
    }
    if (direction.down) {
      this.chageStatus('down');
      this.move({ y: this.y + config.tileScale });
    }
    if (direction.left) {
      this.chageStatus('left');
      this.move({ x: this.x - config.tileScale });
    }
    if (direction.right) {
      this.chageStatus('right');
      this.move({ x: this.x + config.tileScale });
    }
  }

  move({ x, y }: { x?: number; y?: number }) {
    const posx = x ? x : null;
    const posy = y ? y : null;

    if (posx) {
      gsap.to(this, {
        x: posx,
        duration: config.speed,
        ease: 'none',
        onComplete: () => {
          this.isMoving = false;
        },
      });
    }

    if (posy) {
      gsap.to(this, {
        y: posy,
        duration: config.speed,
        ease: 'none',
        onComplete: () => {
          this.isMoving = false;
        },
      });
    }
  }
}
