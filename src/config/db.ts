import watchman from 'customEvents';
import mongoose from 'mongoose';
import CONFIG from './config';

mongoose.Promise = global.Promise;

mongoose.set('useCreateIndex', true);

export const connect = async () => {
  try {
    await mongoose.connect(
      CONFIG.DB_HOST,
      { useNewUrlParser: true }
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
    console.log('The Conection is Ok');
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
