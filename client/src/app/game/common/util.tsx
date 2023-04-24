import config from '../bomb/config';

export const util = {
  getCanvasPos(metrixX: number, metrixY: number) {
    const x = Math.floor(metrixX / config.tileScale) * config.tileScale;
    const y = Math.floor(metrixY / config.tileScale) * config.tileScale;
    return { x, y };
  },
  getMetrixPos(canvasX: number, canvasY: number) {
    const x = Math.floor(canvasX / config.tileScale);
    const y = Math.floor(canvasY / config.tileScale);
    return { x, y };
  },

  getMax(metrixX: number, metrixY: number) {
    const x = Math.ceil(metrixX / config.tileScale) * config.tileScale;
    const y = Math.ceil(metrixY / config.tileScale) * config.tileScale;
    return { x, y };
  },

  mouseRight(e: any) {
    console.log(e.type);
  },
};
