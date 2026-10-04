import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initI18n } from './i18n';
import { installRouter } from './router';

installRouter();

createRoot(document.getElementById('root')!).render(<App />);
requestAnimationFrame(() => setTimeout(initI18n, 0));
