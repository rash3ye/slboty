import watchman from 'customEvents';
import { logger } from 'helpers/logger';
import mongoose from 'mongoose';
import CONFIG from './config';

mongoose.Promise = global.Promise;

export const connect = async () => {
  try {
    logger.info({DBHOST: CONFIG.DB_HOST})
    await mongoose.connect(
      CONFIG.DB_HOST,
      { 
        socketTimeoutMS: 45000,
        family: 4,
        retryWrites: false,
       }
    );

    const db = mongoose.connection;
    db.on('error', (err: any, _db: any) => {
      watchman.emit('db.error', err, _db);
    });
    db.once('open', () => {
      watchman.emit('db.ready', db);
    });

    watchman.on('db.close', () =>
      db.close(async () => {
        await disconnect()
        console.info(db.collection.name + 'database is disconnected');
        watchman.emit("db_closed");
      }),
    );
    // listen for requests
    console.log('Database connected successfully');
    return db;
  } catch (err) {
    console.log(`${err} Could not Connect to the Database. Exiting Now...`);
    process.exit();
  }
}

const disconnect = () => {
  Promise.resolve(mongoose.disconnect());
}

export default { connect, disconnect, mongoose };
