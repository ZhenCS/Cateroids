import { Room } from 'colyseus';
import { Cat } from './cat';

export class GameRoom extends Room {
    onInit(options){
        // Each game instance has 2 clients
        this.maxClients = 2;

        // Need to know which level the room is playing on
        this.levelKey = options.level;

        // Mapping from client ids to a player meta data object
        this.players = [];

        // Construct the state, register it

        this.setSimulationInterval((deltaTime) => this.update(deltaTime));
    }

    requestJoin(options, isNew){
        if (this.clients.length == 1){
            let otherPlayer = getPlayerForClientId(this.clients[0].id);
            // If a player of the corresponding type already exists in the room, reject the connection
            if (otherPlayer.playerType === options.playerType){
                return false;
            }
        }

        return true;
    }

    onJoin(client, options){
        
        this.players[client.id] = new Cat(options);
        // initialize p2 physics object if this player is a cat
    }

    onMessage(client, message){
        // parse input from client
    }

    onLeave(client, consented){

    }

    onDispose(){

    }

    update(deltaTime){

    }

    getPlayerForClientId(clientId){
        return this.players[clientId];
    }

}