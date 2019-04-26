import P2 from 'p2';
import * as constants from '../../shared/constants';

class P2Level extends P2.World{
    constructor(options){
        super(options);

        this.sceneName = options.sceneName || false;
        this.sceneTiledMapFile || false;
        if (!this.sceneName || !this.sceneTiledMapFile){
            console.log('ERROR attempting to create level with options:', options);
        }
        this.mapJson = require('../../client/json/' + this.sceneTiledMapFile);
    }

    populateMap(mapData){
        let mapLayers = this.mapJson.layers,
            mapWidth = this.mapJson.width,
            mapHeight = this.mapJson.height,
            tileWidth = this.mapJson.tilewidth,
            tileHeight = this.mapJson.tileHeight;
        
        // TODO: loop through layers and add asteroid and enemy entities
    }

    createLimits(){
        let mapWidth = this.mapJson.width;
        let mapHeight = this.mapJson.height;

        let topWall = this.createWall(mapWidth, 0.1, mapWidth/2 - 0.5, 0.5);
        topWall.isWorldWall = true;
        this.addBody(topWall);

        let bottomWall = this.createWall(mapWidth, 0.1, mapWidth/2 - 0.5, -(mapHeight - 0.5));
        bottomWall.isWorldWall = true;
        this.addBody(bottomWall);

        let leftWall = this.createWall(0.1, mapHeight + 1, -0.5, -mapHeight/2);
        leftWall.isWorldWall = true;
        this.addBody(leftWall);

        let rightWall = this.createWall(0.1, mapHeight + 1, mapWidht -0.5, -mapHeight/2);
        rightWall.isWorldWall = true;
        this.addBody(rightWall);
    }

    /**
     * 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} x 
     * @param {Number} y 
     */
    createWall(width, height, x, y){
        let boxShape = new P2.Box({ width: width, height: height });
        boxShape.collisionGroup = constants.COLLISION_GROUP_GROUND;
        boxShape.collisionMask = constants.COLLISION_CAT | constants.COLLISION_ANTI_CAT;

        let bodyConfig = {
            position: [x,y],
            mass: 1,
            type: P2.Body.STATIC,
            fixedRotation: true
        };

        let boxBody = new P2.Body(bodyConfig);
        boxBody.addShape(boxShape);
        return boxBody;
    }

}
