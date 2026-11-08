import './styles/tailwind.css';
import './styles/main.scss';
import { createStore, initialState } from './state/store';
import { renderSettings } from './ui/screens/settings';
import { renderGame } from './ui/screens/game';

const app = document.createElement('div');
app.id = 'app';
app.className = 'grid min-h-dvh place-items-center px-3 py-6 sm:px-6 sm:py-8';
document.body.append(app);

const store = createStore(initialState);

const render = (): void => {
  const state = store.getState();
  app.replaceChildren();

  switch (state.status) {
    case 'settings':
      renderSettings(app, state, store);
      break;
    case 'playing':
    case 'won':
      renderGame(app, state, store);
      break;
  }
};

store.subscribe(render);
render();
