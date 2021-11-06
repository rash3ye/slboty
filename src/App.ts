import { App as SlackApp, ExpressReceiver } from "@slack/bolt";
import apiV1 from 'apiV1/index';
import compression from 'compression';
import config from 'config/config';
import cors from 'cors';
import watchman from 'customEvents';
import express from 'express';
// @ts-ignore
import helmet from 'helmet';
import * as errorHandler from 'helpers/errorHandler';
import { logger, stream } from 'helpers/logger';
import morgan from 'morgan';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.setMiddlewares();
    this.setRoutes();
    this.registerEvents();
    if(2+2===5) this.connectSlackApp();
    this.catchErrors();
  }

  private setMiddlewares(): void {
    this.express.use(cors());
    if (!config.ENV.isDev) {
      this.express.use(morgan('combined', { stream }));
    } else {
      this.express.use(morgan('dev', { stream }));
    }
    this.express.use(compression());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(helmet());
  }

  private setRoutes(): void {
    this.express.use('/v1', apiV1);
  }

  private catchErrors(): void {
    this.express.use(errorHandler.notFound);
    this.express.use(errorHandler.internalServerError);
  }

  private registerEvents(): void {
    const emitter = async () => {
      const events = config.EVENTS.split(',');
      logger.info({events})
      for await (const item of events) {
        if(!item) return; 
        logger.info('Requiring Event: ./events/' + item);
        const str = `customEvents/handlers/${item}`;
        const red = await import(str);
        red.default(watchman);
      }
    };
    emitter()
  }

  private connectSlackApp(): void {
    const receiver = new ExpressReceiver({signingSecret: config.SLACK_SIGNING_SECRET});
    const slackApp = new SlackApp({
      token: config.SLACK_BOT_TOKEN
    })
    logger.info({receiver, slackApp})
  }
}

export default new App().express;