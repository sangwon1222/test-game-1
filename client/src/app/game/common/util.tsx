import config from '../bomb/bomberConfig';

export const color = [
  0xf92121 /**빨강 */, 0xff8f29 /**주황 */, 0xffe424 /**황토 */,
  0x23cc23 /**녹색 */, 0x2da2ea /**파랑 */, 0x8a4dff /**보라 */,
];

export const util = {
  getCanvasPos(metrixX: number, metrixY: number) {
    const x = Math.round(metrixX / config.tileScale) * config.tileScale;
    const y = Math.round(metrixY / config.tileScale) * config.tileScale;
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

  bombConsole(msg?: string) {
    const css = 'background: transparent;color:transparent;';
    console.log(
      '%c \n' +
        '%c a' +
        '%c a' +
        '%c a' +
        '%c a' +
        '%c a' +
        '%c \n' +
        '%c a' +
        '%c a' +
        '%c a' +
        '%c a' +
        '%c a' +
        '%c a' +
        '%c \n' +
        '%c a' +
        '%c b' +
        '%c o' +
        '%c m' +
        '%c b' +
        '%c a' +
        `%c ${msg}` +
        '%c \n' +
        '%c a' +
        '%c a' +
        '%c a' +
        '%c a' +
        '%c a' +
        '%c a' +
        '%c \n' +
        '%c a' +
        '%c a' +
        '%c a' +
        '%c a' +
        '%c a' +
        '%c a' +
        '%c \n' +
        '%c a' +
        '%c a' +
        '%c a' +
        '%c a' +
        '%c a' +
        '%c \n',

      `${css}`,
      `${css}`,
      `${css}`,
      `background: #9d3a11;color:#9d3a11;`,
      'background: #aa431a;color:#aa431a;',
      'background: #8f3211;color:#8f3211;',
      `${css}`,

      `${css}`,
      'background: #e36020;color:#e36020;',
      'background: #e4b447;color:#e4b447;',
      'background: #dedb61;color:#dedb61;',
      'background: #ee8938;color:#ee8938;',
      'background: #ed5b27;color:#ed5b27;',

      `${css}`,
      'background: #d45a1d;color:#d45a1d;',
      'background: #fce143;color:#fce143;',
      'background: #e9d98c;color:#e9d98c;',
      'background: #cec37f;color:#cec37f;',
      'background: #ebd970;color:#ebd970;',
      'background: #d05622;color:#d05622;',

      `${
        msg
          ? 'margin:0 10px; padding: 0 10px; background: #ffffff;color:#ff0000;font-weight: bold;'
          : css
      }`,

      `${css}`,
      'background: #ab491c;color:#ab491c;',
      'background: #f7eb66;color:#f7eb66;',
      'background: #fcf799;color:#fcf799;',
      'background: #ece18b;color:#ece18b;',
      'background: #fce674;color:#fce674;',
      'background: #f17637;color:#f17637;',

      `${css}`,
      'background: #a13915;color:#a13915;',
      'background: #d16a2a;color:#d16a2a;',
      'background: #f6d56f;color:#f6d56f;',
      'background: #ffe56b;color:#ffe56b;',
      'background: #da7f42;color:#da7f42;',
      'background: #c84a1d;color:#c84a1d;',
      `${css}`,

      `${css}`,
      'background: #893417;color:#893417;',
      'background: #e1b040;color:#e1b040;',
      'background: #f98e2f;color:#f98e2f;',
      `${css}`,

      `${css}`
    );
  },
};
