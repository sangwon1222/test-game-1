import { AnimatedGIF } from '@pixi/gif';
import { util } from './util';
import BomBer from '../bomb/bomber';

export default util;

export interface GifObjectType {
  [key: string]: AnimatedGIF;
}

export interface DirectionType {
  [key: string]: boolean;
}

export interface BomBerObjectType {
  [key: string]: BomBer;
}

export interface BomBerPosType {
  [key: string]: number[];
}

export interface TypeInitSocketData {
  id: string;
  users: [{ id: string; pos: number[]; status: string }];
  mapData: number[][];
}

export interface TypeEnterSocket {
  id: string;
  pos: number[];
}

export interface TypeMoveSocket {
  id: string;
  pos: number[];
  status: string;
}

export interface TypeFireBomb {
  id: string;
  firePos: number[][];
}
