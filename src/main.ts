import { createStore, initialState } from './state/store';
import { renderSettings } from './ui/screens/settings';
import { renderGame } from './ui/screens/game';

const app = document.createElement('div');
app.id = 'app';
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