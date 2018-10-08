import worker from './worker.mjs';
import startInCluster from './utils/startInCluster.mjs';

// eslint-disable-next-line no-unused-vars
// import init from './init';

const DEBUG = !(process.env.NODE_ENV === 'production');

if (DEBUG) {
  worker();
} else {
  startInCluster(worker);
}
