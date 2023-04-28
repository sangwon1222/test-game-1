import { createRef, useEffect } from 'react';
import Application from '@core/application';
import styled from 'styled-components';
import config from '../canvasConfig';

const app = new Application({
  backgroundColor: config.background,
  width: config.width,
  height: config.height,
});

export default function App() {
  const canvasRef = createRef<HTMLDivElement>();

  const initApplication = async () => {
    canvasRef.current?.appendChild(app.view as HTMLCanvasElement);
    app.start();
    await app.init();
    return () => app.stop();
  };

  const resize = () => {
    const canvasWrap = canvasRef.current;
    const { innerWidth, innerHeight } = window;
    const gameRatio = config.width / config.height;
    let w = config.width;
    let h = config.height;
    if (innerWidth >= config.width) {
      h = innerHeight - 40;
      w = h * gameRatio;
    } else {
      w = innerWidth;
      h = w / gameRatio;
    }
    canvasWrap?.setAttribute(
      'style',
      ` 
        position:relative;
        width:${w}px; 
        height: ${h}px; 
        border-radius: 20px;
        box-shadow:0 20px 50px rgba(255,255,255,0.2);
      `
    );
  };

  useEffect(() => {
    initApplication();
    resize();
    window.addEventListener('resize', resize);
  }, [canvasRef]);

  return (
    <AppWrap>
      <GameWrap ref={canvasRef} />
    </AppWrap>
  );
}

const AppWrap = styled.div`
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #000;
`;
const GameWrap = styled.div`
  & > canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    transform: translate(-50%, -50%);
  }
`;
