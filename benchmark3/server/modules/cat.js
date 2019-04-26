import * as constants from '../../shared/constants';

export class Cat {
    constructor(data){
        this.id = data.id;
        this.playerType = data.playerType;
        this.username = data.username;
        
        // positional data
        this.x = data.x;
        this.y = data.y;
        this.vx = data.vx || 0;
        this.vy = data.vy || 0;
    }
}