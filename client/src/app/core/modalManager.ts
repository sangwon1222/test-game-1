import * as PIXI from 'pixi.js';
import Loading from './loading';

export default class ModalManager extends PIXI.Container {
  private mLoading: Loading;
  constructor() {
    super();
    this.mLoading = new Loading();
    this.addChild(this.mLoading);
  }

  async init() {
    await this.mLoading.init();
  }

  async loadingStart() {
    this.addChild(this.mLoading);
    this.mLoading.start();
  }

  async loadingEnd() {
    this.removeChildren();
    this.mLoading.end();
  }
}
