import './style.css'
import { App }  from './App'

const canvas = document.getElementById('glCanvas') as HTMLCanvasElement;

function resize() {
  const dpr = Math.min(window.devicePixelRatio, 2);
  canvas.width  = Math.floor(canvas.clientWidth  * dpr);
  canvas.height = Math.floor(canvas.clientHeight * dpr);
}

resize();
window.addEventListener('resize', resize);

const app = new App(canvas);
app.start();