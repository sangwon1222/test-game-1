import { rscManager } from '@/app/core/rscManager';
import { AnimatedGIF } from '@pixi/gif';
import * as PIXI from 'pixi.js';
import util, { DirectionType, GifObjectType } from '../common/index';
import { Bomb, PlatBomb } from './bomb';
import BomBerScene from './scene';
import config from './bomberConfig';
import Application from '@/app/core/application';
import { gsap } from 'gsap';

const { tileScale } = config;

export default class BomBer extends PIXI.Container {
  private mItemLayout: PIXI.Container;
  private mCharacterLayout: PIXI.Container;
  private mItems: { [key: string]: PIXI.Sprite };
  private mGifSprite!: GifObjectType;
  private mFixBombCnt: number;
  private mUseBombCnt: number;
  private mIsMoving: boolean;
  private mSocketId: string;
  private mWaitBomb: number;
  private mBombFire: number;
  private mInitData: { name: string; pos: number[]; status: string };
  private mIsAlive = true;

  private get scene() {
    return Application.getHandle.getScene as BomBerScene;
  }

  get invalidBomb(): boolean {
    return this.mFixBombCnt <= this.mUseBombCnt;
  }

  get waitBomb(): number {
    return this.mWaitBomb;
  }
  set waitBomb(v: number) {
    this.mWaitBomb = v;
  }

  get bombFire(): number {
    return this.mBombFire;
  }
  set bombFire(v: number) {
    this.mBombFire = v;
  }

  set isMoving(value: boolean) {
    this.mIsMoving = value;
  }

  set useBomb(value: number) {
    this.mUseBombCnt += 1;
  }

  constructor(
    name: string,
    socketId: string,
    status: string,
    pos: number[],
    bombFire = 3,
    waitBomb = 2,
    fixBomb = 5
  ) {
    super();
    this.mWaitBomb = waitBomb;
    this.mBombFire = bombFire;
    this.mInitData = { name, pos, status };
    this.mSocketId = socketId;
    this.mIsMoving = false;
    this.mFixBombCnt = fixBomb;
    this.mUseBombCnt = 0;
    this.mItems = { bomb: new PlatBomb() };

    this.sortableChildren = true;
    this.mItemLayout = new PIXI.Container();
    this.mCharacterLayout = new PIXI.Container();
    this.mItemLayout.zIndex = 2;
    this.mCharacterLayout.zIndex = 1;
    this.addChild(this.mItemLayout, this.mCharacterLayout);
  }

  async init() {
    const { name, status, pos } = this.mInitData;

    const gif = (name: string) =>
      (rscManager.getHandle.getRsc(name) as AnimatedGIF).clone();

    this.mGifSprite = {
      wait: gif(`${name}-wait.gif`),
      left: gif(`${name}-l.gif`),
      right: gif(`${name}-r.gif`),
      down: gif(`${name}-down.gif`),
      up: gif(`${name}-up.gif`),
      bomb: gif(`${name}-bombing.gif`),
    };

    await this.createCharacter();
    await this.createItem();
    this.chageStatus(status);
    this.position.set(pos[0] * tileScale, pos[1] * tileScale);
  }

  async createCharacter() {
    const list = ['wait', 'up', 'down', 'left', 'right'];
    for (const status of list) {
      const gif = this.mGifSprite[status];
      this.mCharacterLayout.addChild(gif);
    }
    this.mCharacterLayout.pivot.set(tileScale / 2, tileScale / 2);
    this.mCharacterLayout.position.set(tileScale / 2, tileScale / 2);
    const id = new PIXI.Text(this.mSocketId.slice(0, 4), {
      fontSize: 14,
      fill: 0xffffff,
      align: 'center',
      padding: 4,
      stroke: '#000',
      strokeThickness: 8,
    });
    id.y = tileScale - 10;
    this.addChild(id);
  }

  async createItem() {
    const key = Object.keys(this.mItems);
    for (let i = 0; i < key.length; i++) {
      this.mItemLayout.addChild(this.mItems[key[i]]);
      this.mItems[key[i]].visible = false;
    }
  }

  changeItem(itemName: string) {
    const sprites = Object.values(this.mItems);
    for (const item of sprites) {
      item.visible = false;
    }
    if (itemName === 'none') return;
    this.mItems[itemName].visible = true;
  }

  chageStatus(status: string) {
    const gifs = Object.values(this.mGifSprite);
    for (const gif of gifs) {
      gif.visible = false;
    }
    this.mGifSprite[status].visible = true;
  }

  async setDirection(direction: DirectionType) {
    if (!this.mIsAlive) return;
    if (direction.up) {
      await this.move(this.x, this.y - tileScale, 'up');
    }
    if (direction.down) {
      await this.move(this.x, this.y + tileScale, 'down');
    }
    if (direction.left) {
      await this.move(this.x - tileScale, this.y, 'left');
    }
    if (direction.right) {
      await this.move(this.x + tileScale, this.y, 'right');
    }
  }

  async move(x: number, y: number, status: string) {
    if (this.mIsMoving && this.mIsAlive) return;
    const map = this.scene.mapData;

    const matrix = [x / tileScale, y / tileScale];
    const mapValue = map[matrix[1]][matrix[0]];
    if (mapValue === 1) {
      this.chageStatus(status);
      return;
    }

    this.mIsMoving = true;
    this.scene.setMove({ pos: [x, y], status });
  }

  async death() {
    this.mIsAlive = false;
    const gifs = Object.values(this.mGifSprite);
    for (const gif of gifs) {
      gif.stop();
    }
    gsap
      .to(this.mCharacterLayout.scale, { x: 1.2, y: 1.2, duration: 0.5 })
      .repeat(2)
      .yoyo(true)
      .eventCallback('onComplete', () => {
        gsap.to(this.mCharacterLayout.scale, { x: 0, y: 0, duration: 0.5 });
      });
  }
}
