import bomberConfig from '@/app/game/bomb/config';
import { rscManager } from '@core/rscManager';
import Scene from '@core/scene';
import BomBer from './bomber';
import Map from './map';
import config from '@/app/game/bomb/config';
import { io, Socket } from 'socket.io-client';
import gsap from 'gsap';
import { util } from '../common/util';
import { DirectionManager } from './directionManager';

export default class BomBerScene extends Scene {
  private mMyId: number | null = null;
  private mMe: BomBer;
  private mMeMotion: gsap.core.Timeline | null = null;
  private mCharacters: any;
  private mMap: Map;
  private mSocket: Socket | null = null;
  private moveFlag = false;

  get getMePos() {
    const { x, y } = util.getCanvasPos(this.mMe.x, this.mMe.y);
    return { x, y };
  }
  constructor(idx: number, sceneName: string) {
    super(idx, sceneName);

    this.mMe = new BomBer('cha');
    this.mMap = new Map();
    this.mCharacters = {};
    this.mMeMotion = null;
  }

  async startGame() {
    await this.loading();
    await this.createObject();
    await this.connectSocket();

    const cb = () => {
      DirectionManager.getHandle.updateDirection();
      const direction = DirectionManager.getHandle.direction;
      const space = DirectionManager.getHandle.onSpace;
      this.mMe.setDirection(direction);
      if (space) this.mMe.bomb();

      requestAnimationFrame(() => cb());
    };
    requestAnimationFrame(() => {
      cb();
    });
  }

  async loading() {
    await rscManager.getHandle.loadAllRsc(bomberConfig.rscList);
  }

  async createObject() {
    await this.mMap.init();
    await this.mMe.init();
    this.sortableChildren = true;
    this.addChild(this.mMap, this.mMe);
    this.mMap.zIndex = 1;
    this.mMe.zIndex = 2;
  }

  async connectSocket() {
    this.mSocket = io('ws://localhost:3000', {});

    this.mSocket.on('welcome', (info: any) => {
      this.mMyId = info.id;

      for (const userinfo of info.users) {
        const charac = new BomBer('cha');
        charac.position.set(
          userinfo.pos[0] * config.tileScale,
          userinfo.pos[1] * config.tileScale
        );

        if (this.mMyId === userinfo.id) {
          console.log('내정보', userinfo);
        } else {
          this.mCharacters[`${userinfo.id}`] = charac;
          charac.zIndex = 2;
          this.addChild(charac);
        }
      }
    });

    this.mSocket.on('entertUser', (id: number) => {
      console.log('entertUser', id);
    });

    this.mSocket.on('move', ({ id, paths }: { id: number; paths: any }) => {
      const target = this.mCharacters[id] ? this.mCharacters[id] : this.mMe;
      if (this.mMeMotion) this.mMeMotion.kill();
      this.mMeMotion = gsap.timeline();
      const { length } = paths;
      for (let i = 0; i < length; i++) {
        this.mMeMotion.to(target, {
          x: paths[i][0] * config.tileScale,
          y: paths[i][1] * config.tileScale,
          duration: 0.1,
          onStart: () => {
            let status = 'wait';
            const x = paths[i][0];
            const y = paths[i][1];
            if (i > 0) {
              const prevx = paths[i - 1][0];
              const prevy = paths[i - 1][1];
              if (prevx > x) status = 'left';
              else if (prevx < x) status = 'right';
              else if (prevy < y) status = 'down';
              else if (prevy > y) status = 'up';
            }
            if (i === length - 1) status = 'wait';
            target.position.set(x, y);
            this.mMe.chageStatus(status);
          },
        });
      }
    });
  }

  // async endGame() {
  //   core/scene.ts
  // }
}
