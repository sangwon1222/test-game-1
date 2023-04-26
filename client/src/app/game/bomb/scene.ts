import { DirectionManager } from './directionManager';
import bomberConfig from '@/app/game/bomb/config';
import { rscManager } from '@core/rscManager';
import { util } from '../common/util';
import Scene from '@core/scene';
import BomBer from './bomber';
import Map from './map';
import { io, Socket } from 'socket.io-client';
import {
  BomBerObjectType,
  TypeEnterSocket,
  TypeFireBomb,
  TypeMoveSocket,
} from '../common';
import * as PIXI from 'pixi.js';
import config from '@/app/game/bomb/config';
import { gsap } from 'gsap';
import Application from '@/app/core/application';
import { Bomb, Fire } from './bomb';
import { ScenePacket } from './Packet';

export default class BomBerScene extends Scene {
  private mMyId!: string;
  private mMe!: BomBer;
  private mMap!: Map;
  private mBombersInfo: [{ id: string; pos: number[]; status: string }];
  private mBombers: BomBerObjectType;
  private mSocket!: Socket;
  private mMapData!: number[][];
  private mMapLayout!: PIXI.Container;
  private mCharacterLayout!: PIXI.Container;

  get myId() {
    return this.mMyId;
  }
  set myId(id: string) {
    this.mMyId = id;
  }

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
    this.mBombers = {};
    this.mBombersInfo = [{ id: 'init', pos: [1, 1], status: 'wait' }];
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

  async startGame() {
    await this.connectSocket();

    this.mMapLayout = new PIXI.Container();
    this.mMapLayout.zIndex = 1;

    this.mCharacterLayout = new PIXI.Container();
    this.mCharacterLayout.sortableChildren = true;
    this.mCharacterLayout.zIndex = 2;

    this.sortableChildren = true;
    this.addChild(this.mMapLayout, this.mCharacterLayout);

    await rscManager.getHandle.loadAllRsc(bomberConfig.rscList);
    await this.createObject();

    await this.registAnimationFrame();
  }

  async registAnimationFrame() {
    const cb = async () => {
      const { direction } = DirectionManager.getHandle;
      await this.mMe.setDirection(direction);
      requestAnimationFrame(() => cb());
    };
    requestAnimationFrame(() => cb());
  }

  async connectSocket() {
    this.mSocket = io('ws://localhost:3000');

    this.mSocket.on('connect', () => {
      new ScenePacket(this.mSocket);
    });

    // this.mSocket.on('welcome', ({ id, users, mapData }: TypeInitSocketData) => {
    //   console.log('welcome', { id, users });
    //   this.mMyId = id;
    //   this.mMapData = mapData;
    //   this.mBombersInfo = users;
    // });

    this.mSocket.on('entertUser', ({ id, pos }: TypeEnterSocket) => {
      console.log('entertUser', { id });
      if (!this.mBombers[id]) {
        this.insertCharacter(id, pos, 'wait');
      }
    });

    this.mSocket.on('leaveUser', ({ id }: { id: string }) => {
      console.log('leaveUser', id);
      if (this.mBombers[id]) {
        this.mCharacterLayout.removeChild(this.mBombers[id]);
      }
      delete this.mBombers[id];
    });

    this.mSocket.on('move', ({ id, pos, status }: TypeMoveSocket) => {
      const target = id === this.mMyId ? this.mMe : this.mBombers[id];
      if (!target) return;

      gsap.to(target, {
        x: pos[0],
        y: pos[1],
        duration: config.speed,
        onStart: () => {
          target?.chageStatus(status);
        },
        onComplete: () => {
          this.mMe.isMoving = false;
        },
      });

      Application.getHandle.onViewTab = () => {
        if (!target) return;
        gsap.killTweensOf(target);
        target?.chageStatus(status);
        target.position.set(pos[0], pos[1]);
      };
    });

    this.mSocket.on('setBomb', ({ id }: TypeFireBomb) => {
      const target = this.mBombers[id];
      const canvas = util.getCanvasPos(target.x, target.y);
      const bomb = new Bomb(target.bombFire);
      bomb.position.set(canvas.x, canvas.y);
      this.mCharacterLayout.addChild(bomb);
      setTimeout(() => {
        this.mCharacterLayout.removeChild(bomb);
      }, target.waitBomb * 1000);
    });

    this.mSocket.on('fireBomb', ({ id, firePos }: TypeFireBomb) => {
      const fires = [];
      setTimeout(() => {
        this.mSocket.emit('checkDeadUser');
        for (const [x, y] of firePos) {
          const fire = new Fire();
          fire.zIndex = 3;
          fire.position.set(x * config.tileScale, y * config.tileScale);
          this.mCharacterLayout.addChild(fire);
          fires.push(fire);
          fire.on('endFire' as keyof PIXI.DisplayObjectEvents, () => {
            this.mCharacterLayout.removeChild(fire);
            this.mSocket.emit('endBomb', { firePos });
          });
        }
      }, this.mBombers[id].waitBomb * 1000);
    });

    this.mSocket.on('deadUser', ({ users }: { users: string[] }) => {
      console.log(users);
      for (const id of users) {
        this.mBombers[id]?.dead();
      }
    });
  }

  setMove({ id, pos, status }: { id: string; pos: number[]; status: string }) {
    this.mSocket.emit('moveReq', { id: this.mMyId, pos, status });
  }

  async createObject() {
    for (const { id, pos, status } of this.mBombersInfo) {
      await this.insertCharacter(id, pos, status);
    }
    this.mMap = new Map(this.mMapData);
    await this.mMap.init();

    this.mMapLayout.addChild(this.mMap);
  }

  /**@description 캐릭터 삽입 */
  async insertCharacter(socketId: string, pos: number[], status: string) {
    const character = new BomBer('cha', socketId, status, pos);
    await character.init();
    this.mMe = character;
    this.mBombers[socketId] = character;

    this.mCharacterLayout.addChild(character);
  }

  async setBomb() {
    if (this.mMe.invalidBomb) return;
    this.mMe.useBomb += 1;
    const metrix = util.getMetrixPos(this.mMe.x, this.mMe.y);

    this.mSocket.emit('setBomb', {
      id: this.mMyId,
      bombPos: [metrix.x, metrix.y],
      fireScope: this.mMe.bombFire,
    });
  }

  // async endGame() {
  //   core/scene.ts
  // }
}
