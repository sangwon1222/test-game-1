import { BomBerObjectType, TypeBomberSocket, TypeMoveSocket } from '../common';
import { DirectionManager } from './directionManager';
import bomberConfig from '@/app/game/bomb/bomberConfig';
import { rscManager } from '@core/rscManager';
import { util } from '../common/util';
import { SocketIo } from './socket';
import Scene from '@core/scene';
import BomBer from './bomber';
import Map from './map';
import * as PIXI from 'pixi.js';
import canvasConfig from '@/app/canvasConfig';
import Application from '@/app/core/application';
import { gsap } from 'gsap';
import { Spine } from 'pixi-spine';

export default class BomBerScene extends Scene {
  private mLogs: { [key: string]: boolean };
  private mCharacterLayout!: PIXI.Container;
  private mBombersInfo: TypeBomberSocket[];
  private mMapLayout!: PIXI.Container;
  private mBombers: BomBerObjectType;
  private mMapData!: number[][];
  private mUserCount: PIXI.Text;
  private mSocket!: SocketIo;
  private mMyId!: string;
  private mMe!: BomBer;
  private mMap!: Map;

  set clientsCount(v: number) {
    this.mUserCount.text = `접속자 수: ${v} 명`;
  }

  get socket() {
    return this.mSocket;
  }

  get me() {
    return this.mMe;
  }
  set myId(v: string) {
    this.mMyId = v;
  }
  get myId() {
    return this.mMyId;
  }

  get bombers() {
    return this.mBombers;
  }
  get bombersContainer() {
    return this.mCharacterLayout;
  }

  get bombersInfo() {
    return this.mBombersInfo;
  }

  set bombersInfo(info: TypeBomberSocket[]) {
    this.mBombersInfo = info;
  }

  get mapData() {
    return this.mMapData;
  }
  set mapData(mapData: number[][]) {
    this.mMapData = mapData;
  }

  constructor(idx: number, sceneName: string) {
    super(idx, sceneName);
    this.useKeyboard = true;
    this.sortableChildren = true;

    this.mLogs = {};
    this.mBombers = {};
    this.mBombersInfo = [{ socketId: 'init', pos: [1, 1], status: 'wait' }];

    this.mMapLayout = new PIXI.Container();
    this.mMapLayout.zIndex = 1;
    this.mCharacterLayout = new PIXI.Container();
    this.mCharacterLayout.sortableChildren = true;
    this.mCharacterLayout.zIndex = 2;

    this.mUserCount = new PIXI.Text();
  }

  async keydownEvent(e: KeyboardEvent) {
    if (e.key === ' ') this.mMe.changeItem('bomb');
  }
  async keyupEvent(e: KeyboardEvent) {
    if (e.key === ' ') {
      this.setBomb();
      this.mMe.changeItem('none');
    }
  }

  async init() {
    this.mSocket = new SocketIo(this);
    await this.mSocket.init();
  }

  async startGame() {
    const userCountBG = new PIXI.Graphics();
    userCountBG.beginFill(0xffffff, 1);
    userCountBG.drawRect(0, 0, 80, 20);
    userCountBG.endFill();
    userCountBG.zIndex = 3;

    this.mUserCount = new PIXI.Text(`접속자 수: ${this.clientsCount} 명`, {
      fontSize: 12,
      fontWeight: 'bold',
      letterSpacing: -1,
    });
    userCountBG.addChild(this.mUserCount);

    this.addChild(this.mMapLayout, this.mCharacterLayout, userCountBG);
    await rscManager.getHandle.loadAllRsc(bomberConfig.rscList);
    await this.createObject();
    await this.registAnimationFrame();
    Application.getHandle.onViewTab = () => {
      this.mMe.isMoving = false;
      this.mSocket.emit('updateUsersPos');
    };

    const spinedata = rscManager.getHandle.getRsc('Hello.json');
    const helloSpine = new Spine(spinedata.spineData);
    this.addChild(helloSpine);
    helloSpine.zIndex = 100;
    helloSpine.position.set(canvasConfig.width / 2, canvasConfig.height / 2);
    helloSpine.state.setAnimation(0, '01', true);
  }

  async registAnimationFrame() {
    const cb = async () => {
      const { direction } = DirectionManager.getHandle;
      await this.mMe.setDirection(direction);
      requestAnimationFrame(() => cb());
    };
    requestAnimationFrame(() => cb());
  }

  setMove({ pos, status }: TypeMoveSocket) {
    const matrix = [
      pos[0] / bomberConfig.tileScale,
      pos[1] / bomberConfig.tileScale,
    ];
    const mapValue = this.mapData[matrix[1]][matrix[0]];
    if (mapValue === 1) {
      this.mMe.isMoving = false;
      this.mMe.chageStatus(status);
      return;
    }

    this.mSocket.emit('moveReq', { pos, status });
  }

  async createObject() {
    for (const user of this.mBombersInfo) {
      await this.insertUser(user);
    }
    this.mMap = new Map(this.mMapData);
    await this.mMap.init();

    this.mMapLayout.addChild(this.mMap);
  }

  /**@description 캐릭터 삽입 */
  async insertUser({ socketId, pos, status }: TypeBomberSocket) {
    const character = new BomBer('cha', socketId, status, pos);
    await character.init();
    if (this.myId === socketId) this.mMe = character;
    this.mBombers[socketId] = character;

    this.mCharacterLayout.addChild(character);
  }

  leaveUser(socketId: string) {
    const target = this.mBombers[socketId];
    if (target) this.mCharacterLayout.removeChild(target);
  }

  async setBomb() {
    if (this.mMe.invalidBomb) return;
    const metrix = util.getMetrixPos(this.mMe.x, this.mMe.y);

    const socketId = this.myId;
    const bombPos = [metrix.x, metrix.y];
    const fireScope = this.mMe.bombFire;

    this.mSocket.emit('setBomb', { socketId, bombPos, fireScope });
  }

  killLog(msg: string) {
    if (this.mLogs[msg]) return;
    this.mLogs[msg] = true;
    const { length } = Object.values(this.mLogs);
    const text = new PIXI.Text(msg, {
      fontSize: 14,
      fill: 0xff0000,
      fontWeight: 'bold',
    });
    text.anchor.set(1, 0);
    text.position.set(canvasConfig.width, (length - 1) * 20);
    text.zIndex = 3;

    this.addChild(text);

    setTimeout(() => {
      delete this.mLogs[msg];
      this.removeChild(text);
    }, 6000);
  }

  deathUser() {
    const play = new PIXI.Text('play agin', { fill: 0xffffff });
    play.cursor = 'pointer';
    play.anchor.set(0.5);
    play.position.set(canvasConfig.width / 2 - 200, canvasConfig.height / 2);
    play.interactive = true;
    play.on('pointerup', () => {
      dimmed.removeChildren();
      this.removeChild(dimmed);
      this.mBombers[this.myId].alive();
    });

    const watch = new PIXI.Text('watch mode', { fill: 0xffffff });
    watch.anchor.set(0.5);
    watch.cursor = 'pointer';
    watch.position.set(canvasConfig.width / 2 + 200, canvasConfig.height / 2);
    watch.interactive = true;
    watch.on('pointerup', () => {
      dimmed.removeChildren();
      this.removeChild(dimmed);
    });

    const dimmed = new PIXI.Graphics();
    dimmed.beginFill(0x0000, 0.4);
    dimmed.drawRect(0, 0, canvasConfig.width, canvasConfig.height);
    dimmed.endFill();
    dimmed.alpha = 0;
    dimmed.zIndex = 5;
    this.addChild(dimmed);
    gsap.to(dimmed, { alpha: 1, duration: 0.5 });
    dimmed.addChild(play, watch);
  }

  // async endGame() {
  //   core/scene.ts
  // }
}
