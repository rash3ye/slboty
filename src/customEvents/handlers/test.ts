import { EventEmitter } from 'events';

const testEvent = (eventEmitter:EventEmitter): void => {
  console.log("listening @testEvent")
  eventEmitter.on("testEvent", async (msg: string) => {
    try {  
      console.log(msg)
    } catch (err) { 
    }
  })
}

export default testEvent;