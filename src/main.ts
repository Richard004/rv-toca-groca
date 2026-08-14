import '@fontsource/fraunces/600.css';
import '@fontsource/figtree/400.css';
import '@fontsource/figtree/600.css';
import '@fontsource/figtree/700.css';
import '@fontsource/figtree/800.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/chrome.css';
import './styles/scene.css';
import { bootGame } from './game';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootGame);
} else {
  bootGame();
}
