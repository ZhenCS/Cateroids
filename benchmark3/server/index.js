import http from 'http';
import path from 'path';
import express from 'express';
import Colyseus from 'colyseus';
import { GameRoom } from  './modules/gameRoom';
import * as constants from '../shared/constants';

const app = express();
const port = Number(process.env.PORT);
const server = http.createServer(app);

const gameServer = new Colyseus.Server({ server: server });

// register separate room handler for each level
gameServer.register('level_1', GameRoom, { level: constants.LEVEL1KEY });
gameServer.register('level_2', GameRoom, { level: constants.LEVEL2KEY });
gameServer.register('level_3', GameRoom, { level: constants.LEVEL3KEY });
gameServer.register('level_4', GameRoom, { level: constants.LEVEL4KEY });
gameServer.register('level_5', GameRoom, { level: constants.LEVEL5KEY });
gameServer.register('level_6', GameRoom, { level: constants.LEVEL6KEY });