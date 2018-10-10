import express from 'express';
import path from 'path';
import cfg from './config.mjs';
// import morgan from 'morgan';
// инициализация dotenv и добавление примеси в lodash
// eslint-disable-next-line no-unused-vars
// import init from './init';
import router from './router.mjs';

// eslint-disable-next-line no-underscore-dangle
// const __dirname = path.dirname(new URL(import.meta.url).pathname);

//#region META

/** @todo Replace with import.meta eventually */
// const FILENAME = typeof __filename !== 'undefined' ? __filename : (/^ +at (?:file:\/*(?=\/)|)(.*?):\d+:\d+$/m.exec(Error().stack) || '')[1];
// const DIRNAME = typeof __dirname !== 'undefined' ? __dirname : FILENAME.replace(/[\/\\][^\/\\]*?$/, '');
const DIRNAME = typeof __dirname !== 'undefined'
  ? __dirname
  : path.dirname(new URL(import.meta.url).pathname);
//#endregion

console.log('config.DEBUG: ', cfg.DEBUG);
// console.log('cfg: ', cfg);
console.log(process.argv[1], { DIRNAME });

const PORT = process.env.PORT || 5000;
// const REACT_UI_PATH = '../../../cra-rest-node/react-ui/build';
const REACT_UI_PATH = '../react-ui/build/';

const worker = () => {
  const app = express();
  // console.log('path resolve: ', path.resolve(__dirname, REACT_UI_PATH));
  const staticUrl = new URL(REACT_UI_PATH, import.meta.url);
  console.log('import.meta:', import.meta);
  console.log('URL resolve: ', staticUrl.pathname);
  console.log('new URL(index.html, staticUrl)', new URL('index.html', staticUrl).pathname);
  // console.log('path.resolve(__dirname, REACT_UI_PATH)', path.resolve(__dirname, REACT_UI_PATH));
  // Priority serve any static files.
  // app.use(express.static(path.resolve(__dirname, REACT_UI_PATH)));
  // app.use(express.static(path.resolve(DIRNAME, REACT_UI_PATH)));

  const staticPath = cfg.DEBUG
    ? 'E:\\Work\\Projects\\test\\cra\\cra-rest-node\\react-ui\\build'
    : path.resolve(DIRNAME, REACT_UI_PATH);

  const indexPath =  cfg.DEBUG
  ? 'E:\\Work\\Projects\\test\\cra\\cra-rest-node\\react-ui\\build\\index.html'
  : path.resolve(DIRNAME, REACT_UI_PATH, 'index.html');

  app.use(express.static(staticPath));
  // app.use(express.static(new URL(REACT_UI_PATH, import.meta.url).pathname));
  // app.use(express.static(staticUrl.pathname));

  // // Answer API requests.
  // app.get('/api', function (req, res) {
  //   res.set('Content-Type', 'application/json');
  //   res.send('{"message":"Hello from the custom server!"}');
  // });

  app.use('/api', router);

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', (req, res) => {
    // res.sendFile(path.resolve(__dirname, REACT_UI_PATH, 'index.html'));
    // res.sendFile(path.resolve(DIRNAME, REACT_UI_PATH, 'index.html'));
    // console.log('путь', path.resolve('E:\\Work\\Projects\\test\\cra\\cra-rest-node\\react-ui\\build\\index.html'));
    res.sendFile(indexPath);
    // res.sendFile(path.resolve(import.meta.url, REACT_UI_PATH, 'index.html'));
    // console.log('new URL(index.html, staticUrl).pathname', new URL('index.html', staticUrl).pathname);
    // res.sendFile(new URL('index.html', staticUrl).pathname);
  });

  // Error handler
  // next is required: mean that this func is error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // handle error
    // if (err instanceof BadRequestError) {
    console.log('err', err);
    res.status(500);
    return res.send(err.message);
    // }
  });

  app.listen(PORT, () => {
    console.error(`Node (cluster in prod) worker ${process.pid}: listening on port ${PORT}`);
  });
  // }

  // const logger = morgan('combined');
  // app.use(logger);

  // app.use(function(req, res, next) {
  //   res.status(404).send('Sorry cant find that!');
  // });

  // // on error: https://stackoverflow.com/a/27040451/1807736
  // app.listen(port, () => {
  //   console.log(`server started on port ${port}`);
  // }).on('error', (err) => {
  //   if (err.errno === 'EADDRINUSE') {
  //     console.log(`port ${port} is busy`);
  //   } else {
  //     console.log(err);
  //   }
  // });
};

export default worker;
