import * as dotenv from 'dotenv';
dotenv.config();

import app from './src';
import config from './src/config';
import logger from './src/util/logger';


app.listen(config.port, () => {
    logger.log(`server started at port ${config.port}`);
});
