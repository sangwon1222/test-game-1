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
    this.addChild(this.mLoading);
    this.mLoading.visible = false;
  }

  async loadingStart() {
    this.mLoading.visible = true;
    await this.mLoading.start();
  }

  async loadingEnd() {
    await this.mLoading.end();
    this.mLoading.visible = false;
  }
}
