import { DirectionManager } from './directionManager';
import bomberConfig from '@/app/game/bomb/config';
import { rscManager } from '@core/rscManager';
import { util } from '../common/util';
import Scene from '@core/scene';
import BomBer from './bomber';
import Map from './map';
import Application from '@/app/core/application';
import { BomBerObjectType } from '../common';

export default class BomBerScene extends Scene {
  private mMyId!: number;
  private mMe!: BomBer;
  private mMap!: Map;
  private mAnotherUser: BomBerObjectType;

  get getMe() {
    return this.mMe;
  }

  get getMePos() {
    const { x, y } = util.getMetrixPos(this.mMe.x, this.mMe.y);
    return { x, y };
  }

  constructor(idx: number, sceneName: string) {
    super(idx, sceneName);
    this.useKeyboard = true;
    this.mAnotherUser = {};
  }

  async keydownEvent(e: KeyboardEvent) {
    if (e.key === ' ') this.mMe.chageStatus('bomb');
  }
  async keyupEvent(e: KeyboardEvent) {
    if (e.key === ' ') this.mMe.bomb();
  }

  async startGame() {
    await this.loading();
    await this.createObject();

    const cb = async () => {
      const { direction } = DirectionManager.getHandle;
      await this.mMe.setDirection(direction);
      requestAnimationFrame(() => cb());
    };

    requestAnimationFrame(() => cb());

    const socket = Application.getHandle.socket;
    socket.on('welcome', (info: any) => {
      console.log('welcome', info);
    });

    socket.on('entertUser', (id: number) => {
      console.log('entertUser', id);
      if (id === this.mMyId) {
        console.log('my id', id);
      } else {
        this.mAnotherUser[id] = new BomBer('cha', 5);
        this.addChild(this.mAnotherUser[id]);
      }
    });

    socket.on('leaveUser', (id: number) => {
      console.log('leaveUser', id);
      if (id === this.mMyId) {
        console.log('my id', id);
      } else {
        this.removeChild(this.mAnotherUser[id]);
        delete this.mAnotherUser[id];
      }
    });
    socket.on('move', ({ id, paths }: { id: number; paths: any }) => {
      console.log('move', { id, paths });
    });
  }

  async loading() {
    await rscManager.getHandle.loadAllRsc(bomberConfig.rscList);
  }

  async createObject() {
    this.mMe = new BomBer('cha');
    this.mMap = new Map();
    await this.mMap.init();
    this.sortableChildren = true;
    this.addChild(this.mMap, this.mMe);
    this.mMap.zIndex = 1;
    this.mMe.zIndex = 2;
  }

  // async endGame() {
  //   core/scene.ts
  // }
}
