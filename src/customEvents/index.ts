import { EventEmitter } from 'events';

EventEmitter.defaultMaxListeners = 100;

export default new EventEmitter();
export { EventEmitter };
