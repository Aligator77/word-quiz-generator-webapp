import { compose, applyMiddleware, createStore } from 'redux';
import { browserHistory } from 'react-router';
import { syncHistory } from 'react-router-redux';
import thunk from 'redux-thunk';
import persistState from 'redux-localstorage';
import rootReducer from 'redux/reducers';
import transit from 'transit-immutable-js';
import { records as quizRecords } from 'redux/reducers/quiz';
import { records as resourceRecords } from 'redux/reducers/resource';
import { records as settingRecords } from 'redux/reducers/setting';

const recordTransit = transit.withRecords([
  ...quizRecords,
  ...resourceRecords,
  ...settingRecords,
]);

const localStorageConfig = {
  serialize: (subset) => recordTransit.toJSON(subset),
  deserialize: (serializedData) => recordTransit.fromJSON(serializedData),
};

export default function configureStore(initialState = {}) {
  const history = syncHistory(browserHistory);
  const createPersistentStore = compose(
    persistState(null, localStorageConfig),
    applyMiddleware(thunk, history)
  )(createStore);

  return createPersistentStore(rootReducer, initialState);
}