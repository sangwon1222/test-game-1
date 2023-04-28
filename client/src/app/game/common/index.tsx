import { AnimatedGIF } from '@pixi/gif';
import { util } from './util';
import BomBer from '../bomb/bomber';

export default util;

export interface TypeSocketCallbacks {
  [key: string]: void[];
}

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
  socketId: string;
  users: TypeBomberSocket[];
  mapData: number[][];
}

export interface TypeIncomingUserSocket {
  socketId: string;
  pos: number[];
}

export interface TypeBomberSocket {
  socketId: string;
  pos: number[];
  status: string;
}

export interface TypeMoveSocket {
  pos: number[];
  status: string;
}

export interface TypeFireBomb {
  socketId: string;
  firePos: number[][];
}

export interface TypeBombPos {
  socketId: string;
  bombPos: number[];
}

export interface TypeFireBombPos {
  socketId: string;
  firePos: number[][];
}
