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
