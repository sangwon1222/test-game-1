import * as PIXI from 'pixi.js';
import { io, Socket } from 'socket.io-client';
import SceneManager from '@core/sceneManager';
import ModalManager from '@core/modalManager';
import config from '../config';

const params = {
  backgroundColor: config.background,
  width: config.width,
  height: config.height,
};

export default class Application extends PIXI.Application {
  private static handle: Application;
  static get getHandle(): Application {
    return Application.handle ? Application.handle : new Application(params);
  }

  private mSocket!: Socket;
  get socket(): Socket {
    return this.mSocket;
  }

  get getSceneManager(): SceneManager {
    return this.mSceneManager;
  }
  get getModalManager(): ModalManager {
    return this.mModalManager;
  }

  private mSceneManager: SceneManager;
  private mModalManager: ModalManager;
  constructor({
    width,
    height,
    backgroundColor,
  }: {
    width: number;
    height: number;
    backgroundColor: number;
  }) {
    super({
      width,
      height,
      backgroundColor,
    });
    Application.handle = this;
    this.mSceneManager = new SceneManager();
    this.mModalManager = new ModalManager();
  }

  async init() {
    console.log(
      '%c LSW!!',
      'font-weight: bold; font-size: 50px;color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)'
    );
    this.stage.removeChildren();
    this.mSceneManager = new SceneManager();
    this.mModalManager = new ModalManager();
    this.stage.sortableChildren = true;
    this.mSceneManager.zIndex = 1;
    this.mModalManager.zIndex = 2;

    this.stage.addChild(this.mSceneManager, this.mModalManager);

    await this.mSceneManager.init();
    await this.mModalManager.init();
    await this.connectSocket();
    await this.mSceneManager.startGame();
  }

  async connectSocket() {
    this.mSocket = io('ws://localhost:3000', {});

    this.mSocket.on('welcome', (info: any) => {
      //
    });

    this.mSocket.on('entertUser', (id: number) => {
      // console.log('entertUser', id);
    });

    this.mSocket.on('leaveUser', (id: number) => {
      // console.log('leaveUser', id);
    });

    this.mSocket.on('move', ({ id, paths }: { id: number; paths: any }) => {
      // console.log('move', { id, paths });
    });
  }
}
