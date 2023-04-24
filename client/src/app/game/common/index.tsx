import { AnimatedGIF } from '@pixi/gif';
import { util } from './util';

export default util;

export interface GifObjectType {
  [key: string]: AnimatedGIF;
}

export interface DirectionType {
  [key: string]: boolean;
}
