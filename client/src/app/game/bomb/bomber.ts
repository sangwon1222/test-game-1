import { rscManager } from '@/app/core/rscManager';
import { AnimatedGIF } from '@pixi/gif';
import * as PIXI from 'pixi.js';
import util, { DirectionType, GifObjectType } from '../common/index';
import { Bomb, PlatBomb } from './bomb';
import BomBerScene from './scene';
import config from './config';
import { gsap } from 'gsap';

export default class BomBer extends PIXI.Container {
  private mItemLayout: PIXI.Container;
  private mCharacterLayout: PIXI.Container;
  private mGifSprite: GifObjectType;
  private mStatus = 'wait';
  private mBombArray: Array<Bomb>;
  private mFixBombCnt: number;
  private mUseBombCnt: number;
  private isMoving = false;
  private mIsBombing: boolean;

  get bombArray() {
    return this.mBombArray;
  }

  constructor(name: string, fixBomb = 5) {
    super();

    this.mFixBombCnt = fixBomb;
    this.mUseBombCnt = 0;

    this.mItemLayout = new PIXI.Container();
    this.mCharacterLayout = new PIXI.Container();
    this.sortableChildren = true;
    this.mItemLayout.zIndex = 2;
    this.mCharacterLayout.zIndex = 1;
    this.addChild(this.mItemLayout, this.mCharacterLayout);
    this.mGifSprite = {};
    this.mBombArray = [];
    this.mIsBombing = false;
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
    this.mStatus = status;

    switch (status) {
      case 'bomb':
        this.mItemLayout.removeChildren();
        this.mItemLayout.addChild(new PlatBomb());
        break;
      case 'plantedBomb':
        this.mItemLayout.removeChildren();
        break;
      default:
        this.mCharacterLayout.removeChildren();
        this.mCharacterLayout.addChild(this.mGifSprite[status]);
        break;
    }
  }

  async bomb() {
    this.chageStatus('plantedBomb');
    const metrix = util.getMetrixPos(this.x, this.y);
    const canvas = {
      x: metrix.x * config.tileScale,
      y: metrix.y * config.tileScale,
    };

    if (config.mapData[metrix.y][metrix.x] === 1) return;

    if (this.mIsBombing || this.mUseBombCnt >= this.mFixBombCnt) return;
    this.mUseBombCnt += 1;
    this.mIsBombing = true;

    const bomb = new Bomb();
    bomb.position.set(canvas.x, canvas.y);
    bomb.setGlobalPos = { x: canvas.x, y: canvas.y };
    bomb.zIndex = 2;
    this.mBombArray.push(bomb);

    const scene = this.parent as BomBerScene;
    scene.addChild(bomb);

    this.mIsBombing = false;
    await bomb.plantedBomb();
  }

  reduceBombCnt() {
    for (let i = 0; i < this.mBombArray.length; i++) {
      const { isAlive } = this.mBombArray[i];
      if (!isAlive) this.mBombArray.splice(i, 1);
    }
    this.mUseBombCnt = this.mBombArray.length;
  }

  async setDirection(direction: DirectionType) {
    if (this.isMoving) return;

    this.isMoving =
      direction.up || direction.down || direction.left || direction.right;

    const { tileScale } = config;
    if (direction.up) {
      this.chageStatus('up');
      await this.move(0, this.y - tileScale, 'col');
    }
    if (direction.down) {
      this.chageStatus('down');
      await this.move(0, this.y + tileScale, 'col');
    }
    if (direction.left) {
      this.chageStatus('left');
      await this.move(this.x - tileScale, 0, 'row');
    }
    if (direction.right) {
      this.chageStatus('right');
      await this.move(this.x + tileScale, 0, 'row');
    }
  }

  setAlive(alive: boolean) {
    if (alive) return;
    this.setAlive = () => null;
    this.death();
  }

  async move(x: number, y: number, direction: string) {
    const gsapOpt: { [key: string]: any } = {
      x,
      y,
      duration: config.speed,
      ease: 'none',
      onComplete: async () => {
        this.isMoving = false;
      },
    };

    if (direction === 'row') {
      delete gsapOpt.y;
    } else {
      delete gsapOpt.x;
    }
    gsap.to(this, gsapOpt);
  }

  async checkStatus() {
    const { mapData, tileScale } = config;
    const { x, y } = util.getCanvasPos(this.x, this.y);
    // console.log(x, y);
    const metrix = { x: x / tileScale, y: y / tileScale };
    if (mapData[metrix.y][metrix.x] === 1) {
      console.log(x, y);
      gsap.killTweensOf(this);
      this.position.set(x, y);
      return false;
    }
    return true;
  }

  death() {
    console.error('death');
    (this.setDirection as any) = () => null;
  }
}
