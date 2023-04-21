import bomberConfig from '@/app/game/bomb/config';
import { rscManager } from '@core/rscManager';
import Scene from '@core/scene';
import BomBer from './bomber';
import Map from './map';
import config from '@/app/game/bomb/config';
import { io, Socket } from 'socket.io-client';
import gsap from 'gsap';

export default class BomBerScene extends Scene {
  private mMyId: number | null = null;
  private mMe: BomBer;
  private mCharacters: any;
  private mMap: Map;
  private mSocket: Socket | null = null;
  constructor(idx: number, sceneName: string) {
    super(idx, sceneName);

    this.mMe = new BomBer('cha');
    this.mMap = new Map();
    this.mCharacters = {};
  }

  async startGame() {
    await this.loading();
    await this.createObject();
    await this.connectSocket();
  }

  async loading() {
    await rscManager.getHandle.loadAllRsc(bomberConfig.rscList);
  }

  async createObject() {
    await this.mMap.init();
    await this.mMe.init();
    this.mMe.position.set(config.tileScale, config.tileScale);
    this.addChild(this.mMap, this.mMe);
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
          this.addChild(charac);
        }
      }
    });

    this.mSocket.on('entertUser', (id: number) => {
      console.log('entertUser', id);
    });

    this.mSocket.on('move', ({ id, paths }: { id: number; paths: any }) => {
      const target = this.mCharacters[id] ? this.mCharacters[id] : this.mMe;
      const motion = gsap.timeline();
      for (const pos of paths) {
        motion.to(target, {
          x: pos[0] * config.tileScale,
          y: pos[1] * config.tileScale,
          duration: 0.1,
          onStart: () => {
            console.log(target.position);
            target.position.set(pos[0], pos[1]);
          },
        });
      }
    });
  }

  async moveCharacter(x: number, y: number) {
    const mypos = this.metrixPos(this.mMe.x, this.mMe.y);
    const despos = this.metrixPos(x, y);
    this.mSocket?.emit('moveReq', {
      id: this.mMyId,
      startPos: mypos,
      endPos: despos,
    });
  }

  metrixPos(x: number, y: number) {
    return { x: x / config.tileScale, y: y / config.tileScale };
  }

  // async endGame() {
  //   core/scene.ts
  // }
}
