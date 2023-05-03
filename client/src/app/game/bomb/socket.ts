import { Socket, io } from 'socket.io-client';
import {
  TypeIncomingUserSocket,
  TypeInitSocketData,
  TypeBomberSocket,
  TypeFireBombPos,
  TypeBombPos,
  TypeLeaveUser,
} from '../common';
import config from './bomberConfig';
import { Bomb, Fire } from './bomb';
import BomBerScene from './scene';
import { gsap } from 'gsap';
import BomBer from './bomber';

const { tileScale, speed } = config;

export class SocketIo {
  private socket: Socket;
  private socketOn: OnEvent;

  constructor(scene: BomBerScene) {
    this.socketOn = new OnEvent(scene);

    const link =
      process.env.NODE_ENV === 'production'
        ? 'http://lsw.kr:3000'
        : 'localhost:3000';
    this.socket = io(link, {});
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
  // welcome({ socketId, users, mapData }: TypeInitSocketData) {
  welcome({ socketId, users, mapData, clientsCount }: TypeInitSocketData) {
    console.log('welcome', socketId);
    this.scene.myId = socketId;
    this.scene.bombersInfo = users;
    this.scene.mapData = mapData;
    this.scene.clientsCount = clientsCount;
  }

  incomingUser({ socketId, pos, clientsCount }: TypeIncomingUserSocket) {
    this.scene.clientsCount = clientsCount;
    this.scene.insertUser({ socketId, pos, status: 'wait' });
  }

  leaveUser({ socketId, clientsCount }: TypeLeaveUser) {
    this.scene.clientsCount = clientsCount;
    this.scene.leaveUser(socketId);
    delete this.scene.bombers[socketId];
  }

  move({ socketId, pos, status }: TypeBomberSocket) {
    const target = this.scene.bombers[socketId];
    if (!target) return;
    if (pos.length === 0) {
      target?.chageStatus(status);
      target.isMoving = false;
      return;
    }

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
  }

  setBomb({ socketId, bombPos }: TypeBombPos) {
    this.scene.bombers[socketId].useBomb += 1;
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
      this.scene.bombers[socketId].useBomb -= 1;
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
      console.error(death);
      this.scene.bombers[death]?.death();
    }
  }

  updateUsersPos({ users }: { users: TypeBomberSocket[] }) {
    for (const user of users) {
      const target = this.scene.bombers[user.socketId];
      gsap.killTweensOf(target);
      target.position.set(
        user.pos[0] * config.tileScale,
        user.pos[1] * config.tileScale
      );
    }
  }
}
