import { rscManager } from '@/app/core/rscManager';
import * as PIXI from 'pixi.js';
import config from './config';
import BomBerScene from './scene';

/**
 * @param mode :boolean 이동 가능한지 불가능한지.
 * @param rscName :string 리소스 이름.
 * @param pos :{x: 타일의 x좌표, y: 타일의 y 좌표}.
 */
export class Tile extends PIXI.Sprite {
  constructor(isActive: boolean, pos: { x: number; y: number }) {
    super();
    const rsc = isActive ? 'grass' : 'wall';
    const texturePath = rscManager.getHandle.getRsc(`${rsc}.png`);
    this.texture = new PIXI.Texture(texturePath);
  }
}
