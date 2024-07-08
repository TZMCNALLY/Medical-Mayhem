// import { Actor, Vector, Color } from "excalibur";
import { Actor, Color } from "excalibur";
import * as ex from 'excalibur'
import{ Config } from './config'
import { Resources } from "../resources";
import socket from "../../constants/socket";
import SocketEvents from "../../constants/socketEvents";
import Patient from "./patient";

export const PlayerCollisionGroup = ex.CollisionGroupManager.create('player')

export default class Player extends Actor {
    constructor(username, isMyPlayer = false) {
        super({
            z: 100,
            pos: ex.vec(279, 194),
            width: 25,
            height: 25,
            collisionType: ex.CollisionType.Active,
            color: Color.Chartreuse,
            collisionGroup: PlayerCollisionGroup
        })
        this.isMyPlayer = isMyPlayer // is this a teammate, or the player that the user is currently controlling?
        this.username = username // string
        this.guidingPatient = null // a reference to the patient being guided by the player
        this.treatingPatient = null;
        this.posCorrection = null
        this.engine = null;
    }

    onInitialize(engine) {
        this.engine = engine;
        const playerSpriteSheet = ex.SpriteSheet.fromImageSource({
            image: Resources.PlayerPng,
            grid: {
                spriteWidth: 64,
                spriteHeight: 64,
                rows: 2,
                columns: 2
            }
        })
        this.scale = ex.vec(.75,.75)
        const leftIdle = new ex.Animation({
            frames: [
                {graphic: playerSpriteSheet.getSprite(0, 0), duration: Config.PlayerFrameSpeed},
            ]
        })
        this.graphics.add('left-idle', leftIdle);

        const rightIdle = new ex.Animation({
            frames: [
                {graphic: playerSpriteSheet.getSprite(0, 0), duration: Config.PlayerFrameSpeed},
            ]
        })
        this.graphics.add('right-idle', rightIdle);


        const upIdle = new ex.Animation({
            frames: [
                {graphic: playerSpriteSheet.getSprite(1, 1), duration: Config.PlayerFrameSpeed},
            ]
        })
        this.graphics.add('up-idle', upIdle);

        const downIdle = new ex.Animation({
            frames: [
                {graphic: playerSpriteSheet.getSprite(0, 0), duration: Config.PlayerFrameSpeed},
            ]
        })
        this.graphics.add('down-idle', downIdle);

        const leftWalk = new ex.Animation({
            frames: [
                {graphic: playerSpriteSheet.getSprite(0, 0), duration: Config.PlayerFrameSpeed},
                {graphic: playerSpriteSheet.getSprite(1, 0), duration: Config.PlayerFrameSpeed},
            ]
        })
        this.graphics.add('left-walk', leftWalk);

        const rightWalk = new ex.Animation({
            frames: [
                {graphic: playerSpriteSheet.getSprite(0, 0), duration: Config.PlayerFrameSpeed},
                {graphic: playerSpriteSheet.getSprite(1, 0), duration: Config.PlayerFrameSpeed},
            ]
        });
        this.graphics.add('right-walk', rightWalk);

        const upWalk = new ex.Animation({
            frames: [
                {graphic: playerSpriteSheet.getSprite(0, 1), duration: Config.PlayerFrameSpeed},
                {graphic: playerSpriteSheet.getSprite(1, 1), duration: Config.PlayerFrameSpeed},
            ]
        });
        this.graphics.add('up-walk', upWalk);

        const downWalk = new ex.Animation({
            frames: [
                {graphic: playerSpriteSheet.getSprite(0, 0), duration: Config.PlayerFrameSpeed},
                {graphic: playerSpriteSheet.getSprite(1, 0), duration: Config.PlayerFrameSpeed},
            ]
        });
        this.graphics.add('down-walk', downWalk);

        // EVENT HANDLING

        socket.on(SocketEvents.PLAYER_MOVED, (data) => {

            // console.log(data)
            if (data.username === this.username) {
                this.vel = ex.vec(data.vel._x, data.vel._y)
                if (data.vel._x == 0 && data.vel._y == 0) {
                    this.graphics.use('down-idle');
                } else if (data.vel._x == Config.PlayerSpeed && data.vel._y == 0) {
                    this.graphics.use('right-walk');
                } else if (data.vel._x == -Config.PlayerSpeed && data.vel._y == 0) {
                    this.graphics.use('left-walk');
                } else if (data.vel._x == 0 && data.vel._y == Config.PlayerSpeed) {
                    this.graphics.use('down-walk');
                } else if (data.vel._x == 0 && data.vel._y == -Config.PlayerSpeed) {
                    this.graphics.use('up-walk');
                }
            }
        })

        socket.on(SocketEvents.STOP_FOLLOW, (data) => {
            // console.log(data)
            if (data.username === this.username) {
                if (this.guidingPatient !== null) {
                    this.guidingPatient.actions.clearActions();
                    this.guidingPatient.setFollowing(false);
                    this.guidingPatient = null;
                }
            }
        })

        // socket.on(SocketEvents.TREAT_PATIENT, (data) => {
        //     console.log(data)
        //     if (data.username === this.username) {
        //         if (this.treatingPatient !== null) {
        //             this.treatingPatient = null;
        //         }
        //     }
        // })

        this.on('collisionstart', (event) => {
            if (event.other.name !== "Tile Layer 2") {
                console.log(event.other);
                if (event.other.followingDoctor == false && this.guidingPatient == null && event.other.treating == false) {
                    event.other.setFollowing(true);
                    this.guidingPatient = event.other
                    this.guidingPatient.actions.follow(this, 50)
                }
            }
        })
    }

    onPreUpdate(engine, elapsedMs) {
        if (this.isMyPlayer) {
            this.graphics.use('down-idle');

            const lastVel = this.vel
            this.vel = ex.Vector.Zero;

            if (engine.input.keyboard.isHeld(ex.Keys.D)) {
                this.vel = ex.vec(Config.PlayerSpeed, 0);
                
                this.graphics.use('right-walk');
            }
            if (engine.input.keyboard.isHeld(ex.Keys.A)) {
                this.vel = ex.vec(-Config.PlayerSpeed, 0);

                this.graphics.use('left-walk');
            }
            if (engine.input.keyboard.isHeld(ex.Keys.W)) {
                this.vel = ex.vec(0, -Config.PlayerSpeed);

                this.graphics.use('up-walk');
            }
            if (engine.input.keyboard.isHeld(ex.Keys.S)) {
                this.vel = ex.vec(0, Config.PlayerSpeed);

                this.graphics.use('down-walk');
            }
            if (engine.input.keyboard.wasPressed(ex.Keys.E) && this.guidingPatient !== null) {
                this.guidingPatient.actions.clearActions();

                let tilePath = engine.currentScene.world.scene.tileMaps[0].getTileByPoint(this.guidingPatient.pos)._graphics[0].image.path;
                console.log(tilePath); 
                // 17, 18, 19, 20, 21
                if (tilePath === "/static/media/Hospital_Tiles-17.png" || tilePath === "/static/media/Hospital_Tiles-18.png" || tilePath === "/static/media/Hospital_Tiles-19.png" || tilePath === "/static/media/Hospital_Tiles-20.png" || tilePath === "/static/media/Hospital_Tiles-21.png") {
                    console.log("START MINIGAME");
                    // const patient = new Patient()
                    // this.engine.currentScene.add(patient)
                    const rand = new ex.Random()
                    if (rand.integer(0,1) === 0) {
                        this.engine.goToScene("medicationmatching", {sceneActivationData: {yourScore: 0, opponentScore: 0, prevScene: this.engine.currentSceneName}});
                        this.treatingPatient = this.guidingPatient;
                        this.treatingPatient.setTreating(true);
                        socket.emit(SocketEvents.START_TREAT_PATIENT, {
                            username: this.username,
                            patient: this.treatingPatient.patientId
                        })
                        setTimeout(() => {
                            socket.emit(SocketEvents.TREAT_PATIENT, {
                                username: this.username,
                                patient: this.treatingPatient.patientId
                            })
                        }, 15000);
                    } else {
                        this.engine.goToScene("heartbeatrhythm", {sceneActivationData: {yourScore: 0, opponentScore: 0, prevScene: this.engine.currentSceneName}});
                        this.treatingPatient = this.guidingPatient;
                        this.treatingPatient.setTreating(true);
                        socket.emit(SocketEvents.START_TREAT_PATIENT, {
                            username: this.username,
                            patient: this.treatingPatient.patientId
                        })
                        setTimeout(() => {
                            socket.emit(SocketEvents.TREAT_PATIENT, {
                                username: this.username,
                                patient: this.treatingPatient.patientId
                            })
                        }, 30000);
                    }
                }
                socket.emit(SocketEvents.STOP_FOLLOW, {
                    id: this.guidingPatient.patientId,
                    username: this.username,
                })
                this.guidingPatient = null;
            }

            // updates velocity for other player's referene to this player if it isn't the same as last frame
            if (!this.vel.equals(lastVel))
                socket.emit(SocketEvents.PLAYER_MOVED, {
                    username: this.username,
                    vel: this.vel,
                })
        }
    }

    onPostUpdate(engine, elapsedMs) {
        if(this.posCorrection && 
            (this.pos.x !== this.posCorrection._x || 
            this.pos.y !== this.posCorrection._y)) {
                this.pos = ex.vec(this.posCorrection._x, this.posCorrection._y)
                this.posCorrection = null
            }
    }
}