import path from 'path';
import errorHandler from 'errorhandler';
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import routes from './routes/routes';
import { configurePool } from './postgres';
import './utils/env';

const DEFAULT_PORT = 3000;
const STATIC_MAX_AGE = 31557600000;

const app = express();
app.set('port', process.env.PORT || DEFAULT_PORT);

if (process.env.NODE_ENV !== 'production') {
  app.use(errorHandler());
}

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './build'), { maxAge: STATIC_MAX_AGE }));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, './build/index.html')));
app.use(routes.route, routes.router);

const httpsServer = createServer(app);

configurePool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

httpsServer.listen(app.get('port'), () => {
  console.log('  App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});
