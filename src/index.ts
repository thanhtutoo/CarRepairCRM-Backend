import * as express from 'express';
import { apiRouter } from './api';
import { appMiddleware, errorHandler } from './middleware';
import logger from './util/logger';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
var path = require('path');

let app = express();

let dir = path.dirname(require.main.filename);
app.use('/public', express.static(path.join(dir, '/public'), { redirect: false }));

app.use(cors());
app.use(appMiddleware(app));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', apiRouter);
app.use(errorHandler);

export default app;
