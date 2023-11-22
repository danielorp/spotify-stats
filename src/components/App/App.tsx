import axios from 'axios';
import { Fragment } from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import { getUser } from '../../services/conduit';
import { store } from '../../state/store';
import { useStoreWithInitializer } from '../../state/storeHooks';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { Home } from '../Pages/Home/Home';
import { endLoad, loadUser } from './App.slice';

export function App() {
  const { loading } = useStoreWithInitializer(({ app }) => app, load);

  return (
    <HashRouter>
      {!loading && (
        <Fragment>
          <Header />
          <Switch>
            <Route path='/'>
              <Home />
            </Route>
            <Route path='/:access_token'>
              <Home />
            </Route>
          </Switch>
          <Footer />
        </Fragment>
      )}
    </HashRouter>
  );
}

async function load() {
  const token = localStorage.getItem('token');
  if (!store.getState().app.loading || !token) {
    store.dispatch(endLoad());
    return;
  }
  axios.defaults.headers.Authorization = `Token ${token}`;

  try {
    store.dispatch(loadUser(await getUser()));
  } catch {
    store.dispatch(endLoad());
  }
}
