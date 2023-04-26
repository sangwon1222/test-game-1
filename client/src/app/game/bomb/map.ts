import * as PIXI from 'pixi.js';
import { Tile } from './mapTile';
import config from './config';

export default class Map extends PIXI.Container {
  private mMapData: number[][];

  get mapData() {
    return this.mMapData;
  }
  constructor(mapData: number[][]) {
    super();
    this.mMapData = mapData;
  }

  async init() {
    await this.changeMap();
  }

  async changeMap() {
    this.removeChildren();
    const map = this.mMapData;
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        const isActive = !map[y][x];
        const pos = { x: x * config.tileScale, y: y * config.tileScale };
        const tile = new Tile(isActive, pos);
        tile.position.set(pos.x, pos.y);
        this.addChild(tile);
      }
    }
  }
}
