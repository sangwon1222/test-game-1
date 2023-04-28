import { Socket, io } from 'socket.io-client';
import {
  TypeIncomingUserSocket,
  TypeInitSocketData,
  TypeBomberSocket,
  TypeFireBombPos,
  TypeBombPos,
} from '../common';
import BomBerScene from './scene';
import { gsap } from 'gsap';
import config from './bomberConfig';
import Application from '@/app/core/application';
import { Bomb, Fire } from './bomb';
import BomBer from './bomber';

const { tileScale, speed } = config;

export class SocketIo {
  private socket: Socket;
  private socketOn: OnEvent;

  constructor(scene: BomBerScene) {
    this.socketOn = new OnEvent(scene);
    this.socket = io('ws://localhost:3000');
  }

  async init() {
    this.socket.on('connect', () => {
      console.log('connect');
    });

    const onPrototype = this.socketOn.constructor.prototype;

    for (const funcName of Object.getOwnPropertyNames(onPrototype)) {
      if (funcName === 'constructor') continue;
      this.socket.on(funcName, ({ ...args }) =>
        (this.socketOn as any)[funcName]({ ...args })
      );
    }
  }

  emit(eventName: string, args?: any) {
    this.socket.emit(eventName, { ...args });
  }
}

export class OnEvent {
  private scene: BomBerScene;
  constructor(scene: BomBerScene) {
    this.scene = scene;
  }
  welcome({ socketId, users, mapData }: TypeInitSocketData) {
    console.log('welcome', socketId);
    this.scene.setId(socketId);
    this.scene.bombersInfo = users;
    this.scene.mapData = mapData;
  }

  incomingUser({ socketId, pos }: TypeIncomingUserSocket) {
    console.log('incomingUser', socketId);
    this.scene.insertUser({ socketId, pos, status: 'wait' });
  }

  leaveUser({ socketId }: { socketId: string }) {
    this.scene.leaveUser(socketId);
    delete this.scene.bombers[socketId];
  }

  move({ socketId, pos, status }: TypeBomberSocket) {
    const target = this.scene.bombers[socketId];
    if (!target) return;

    gsap.to(target, {
      x: pos[0],
      y: pos[1],
      duration: speed,
      onStart: () => {
        target?.chageStatus(status);
      },
      onComplete: () => {
        target.isMoving = false;
      },
    });

    Application.getHandle.onViewTab = () => {
      if (!target) return;
      gsap.killTweensOf(target);
      target?.chageStatus(status);
      target.position.set(pos[0], pos[1]);
    };
  }

  setBomb({ socketId, bombPos }: TypeBombPos) {
    console.log('setBomb');
    const target = this.scene.bombers[socketId] as BomBer;
    const bomb = new Bomb(target.bombFire);
    bomb.position.set(bombPos[0] * tileScale, bombPos[1] * tileScale);
    this.scene.bombersContainer.addChild(bomb);

    setTimeout(() => {
      this.scene.socket.emit('fireBomb', {
        socketId,
        bombPos,
        fireScope: target.bombFire,
      });
      this.scene.bombersContainer.removeChild(bomb);
    }, target.waitBomb * 1000);
  }

  fireBomb({ firePos }: TypeFireBombPos) {
    const fires = [];
    for (const [x, y] of firePos) {
      const fire = new Fire();
      fire.zIndex = 3;
      fire.position.set(x * tileScale, y * tileScale);
      this.scene.bombersContainer.addChild(fire);
      fires.push(fire);
      fire.on('endFire' as never, () => {
        this.scene.bombersContainer.removeChild(fire);
        this.scene.socket.emit('endBomb', { firePos });
      });
    }
  }

  deathUser({ info }: { info: { killer: string; death: string }[] }) {
    for (const { killer, death } of info) {
      this.scene.killLog(`[${killer.slice(4)}] kill => [${death.slice(4)}]`);
      this.scene.bombers[death]?.death();
      delete this.scene.bombers[death];
    }
  }
}
