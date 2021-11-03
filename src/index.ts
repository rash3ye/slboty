import { config } from 'dotenv';
import 'module-alias/register';
import 'reflect-metadata';
import { connect } from './config/db';
import { getIPAddress, properCase } from './helpers/utils';
config();

const app = require('./App').default;
const CONFIG = require('./config/config').default;

const PORT = CONFIG.PORT;
const db = connect();

app.set('db', db)

app.listen(PORT, () => {
  console.log('  App is running at http://localhost:%d in %s mode', PORT, app.get('env'));
  console.log(`
        ${properCase(app.get('env'))} Server is running at: 
          - Local: http://localhost:${Number(PORT)}
          - Network: http://${getIPAddress()}:${Number(PORT)}
        `);
  console.log('  Press CTRL-C to stop\n');
});