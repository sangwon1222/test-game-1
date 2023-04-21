import { config } from '@/app/core/config';
import { rscManager } from '@/app/core/rscManager';
import * as PIXI from 'pixi.js';

export default class BomBer extends PIXI.Container {
  private mName: string;
  private mGifSprite: any;

  constructor(name: string) {
    super();
    this.mName = name;
    this.mGifSprite = null;
  }

  async init() {
    const name = this.mName;
    this.mGifSprite = {
      wait: rscManager.getHandle.getRsc(`${name}-wait.gif`),
      left: rscManager.getHandle.getRsc(`${name}-r.gif`),
      right: rscManager.getHandle.getRsc(`${name}-r.gif`),
      down: rscManager.getHandle.getRsc(`${name}-down.gif`),
      up: rscManager.getHandle.getRsc(`${name}-down.gif`),
    };
    this.chageStatus('wait');
  }

  chageStatus(status: string) {
    this.removeChildren();
    this.addChild(this.mGifSprite[status]);
  }
}
