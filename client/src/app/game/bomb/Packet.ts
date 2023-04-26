import { Socket } from 'socket.io-client';
import { TypeInitSocketData } from '../common';
import Application from '@/app/core/application';
import Scene from '@/app/core/scene';

export class Packet {
  private mSocket: Socket;

  constructor(socket: Socket) {
    this.mSocket = socket;
  }

  bindSocket() {
    const a = this.constructor.prototype;
    for (const funcName of Object.getOwnPropertyNames(a)) {
      this.mSocket.on('on_' + funcName, (...args) => {
        (this as any)['on_' + funcName](...args);
      });
    }

    // this.mSocket.on('', () => {
    //
    // });
  }
}

export class ScenePacket extends Packet {
  private mScene: any;
  constructor(socket: Socket) {
    super(socket);
    const scene = Application.getHandle.getScene as Scene;
    this.mScene = Object.assign(scene, this) as any;

    this.bindSocket();
  }

  on_welcome({ id, users, mapData }: TypeInitSocketData) {
    console.log('welcome', { id, users, mapData });
    this.mScene.myId = id;
    this.mScene.mMapData = mapData;
    this.mScene.mBombersInfo = users;
  }
  on_entertUser() {
    //
  }
}
