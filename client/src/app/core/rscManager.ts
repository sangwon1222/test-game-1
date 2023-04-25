import Application from './application';
import { AnimatedGIF } from '@pixi/gif';
import * as PIXI from 'pixi.js';
import '@pixi/gif';

interface TypeSrcInfo {
  key: string;
  src: string;
  common?: boolean;
  sceneName?: string;
}

interface TypeRscList {
  [key: string]: any;
}

export class rscManager {
  private static handle: rscManager;
  private mRscArry: TypeRscList;

  static get getHandle(): rscManager {
    const handle = rscManager.handle ? rscManager.handle : new rscManager();
    return handle;
  }

  get getRscList() {
    return this.mRscArry;
  }

  constructor() {
    rscManager.handle = this;
    this.mRscArry = {};
  }

  /**
   * @param key 리소스 키값, ex) common (true=> common/[key]) , (false=> [scene-name]/[key])
   * @param src 리소스 경로, ex) 'rsc/img/[key]'
   * @param common 여러 씬에서 공동으로 쓰일 경우 true, 아니면 안넣어줘도 된다.
   */
  public async loadRsc(
    key: string,
    src: string,
    common?: boolean,
    sceneName?: string
  ) {
    const currentSceneName =
      Application.getHandle.getSceneManager?.currentSceneInfo?.sceneName;
    const scene = sceneName ? sceneName : currentSceneName;
    const rscKey = common ? `common/${key}` : `${scene}/${key}`;

    if (this.mRscArry[rscKey]) return;
    PIXI.Assets.add(rscKey, src);

    this.mRscArry[rscKey] = await PIXI.Assets.load(src);
  }

  /**
   * @description 배열로 리소스 리스트를 보내주면 모든 리소스 로드하는 함수
   */
  public async loadAllRsc(rscInfoAry: TypeSrcInfo[]) {
    const sceneName =
      Application.getHandle.getSceneManager?.currentSceneInfo?.sceneName;
    for (const { key, src, common } of rscInfoAry) {
      await this.loadRsc(key, src, common, sceneName);
    }
  }

  /**
   * @param srcKey 리소스 이름 ex) bomb.png, bomb.gif
   * @param common 공동으로 쓰이고 있으면 true, 없으면 안넣어줘도 된다.
   * @returns
   */
  public getRsc(srcKey: string, common?: boolean) {
    const sceneName =
      Application.getHandle.getSceneManager?.currentSceneInfo?.sceneName;
    const key = common ? `common/${srcKey}` : `${sceneName}/${srcKey}`;

    const clone = this.mRscArry[key].clone();
    return clone;
  }
}
