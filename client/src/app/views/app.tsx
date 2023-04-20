import { createRef, useEffect } from 'react';
import Application from '@core/application';

const app = new Application({
  backgroundColor: 0x000000,
  width: window.innerWidth,
  height: window.innerHeight,
});

export default function App() {
  const canvasRef = createRef<HTMLDivElement>();
  useEffect(() => {
    canvasRef.current?.appendChild(app.view as HTMLCanvasElement);
    app.start();
    app.init();

    return () => app.stop();
  }, []);

  return <div ref={canvasRef} tabIndex={0}></div>;
}
