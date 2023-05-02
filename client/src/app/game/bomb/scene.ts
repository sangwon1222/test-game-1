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

export default class BomBerScene extends Scene {
  private mCharacterLayout!: PIXI.Container;
  private mMapLayout!: PIXI.Container;
  private mBombersInfo: TypeBomberSocket[];
  private mBombers: BomBerObjectType;
  private mMapData!: number[][];
  private mMyId!: string;
  private mMe!: BomBer;
  private mMap!: Map;
  private mSocket!: SocketIo;
  private mLogs: { [key: string]: boolean };

  get socket() {
    return this.mSocket;
  }

  get me() {
    return this.mMe;
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
    this.addChild(this.mMapLayout, this.mCharacterLayout);
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

  setId(socketId: string) {
    this.mMyId = socketId;
    this.setId = () => null;
  }
  async init() {
    this.mSocket = new SocketIo(this);
    await this.mSocket.init();
  }

  async startGame() {
    this.addChild(this.mMapLayout, this.mCharacterLayout);
    await rscManager.getHandle.loadAllRsc(bomberConfig.rscList);
    await this.createObject();
    await this.registAnimationFrame();
    Application.getHandle.onViewTab = () => {
      this.mMe.isMoving = false;
      this.mSocket.emit('updateUsersPos');
    };
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
    this.mMe.useBomb += 1;
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

  // async endGame() {
  //   core/scene.ts
  // }
}
