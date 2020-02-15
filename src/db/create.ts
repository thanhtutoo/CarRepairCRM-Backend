import * as dotenv from 'dotenv';
dotenv.config();

import config from '../config';
import logger from '../util/logger';

import { createDatabase } from './migrate';

createDatabase();
