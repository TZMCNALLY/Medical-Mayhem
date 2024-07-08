/**
 * Heartbeat Rhythm
 */

import { Actor, Color, CollisionType, vec, Keys, Text, Font, TextAlign, Scene } from "excalibur";
import socket from "../../constants/socket";
import SocketEvents from "../../constants/socketEvents";
// import { TiledResource } from '@excaliburjs/plugin-tiled'

export class HeartbeatRhythmScene extends Scene {

    engine;
    timeText;
    yourScore;
    opponentScore;

    onInitialize(engine) {
        console.log("STARTING HEARTBEAT GAME");
        this.initializeText(engine);
        this.initializeTimeText(engine);
        this.yourScore = this.initializeScore(this.engine);
        this.opponentScore = this.initializeTeamScore(this.engine);
        this.initializeBar(engine, this.yourScore);
        const createRandomProjectile = () => {
            const interval = Math.floor(Math.random() * (1500 - 300 + 1)) + 300;
            setTimeout(() => {
                if (this.timeText.time > 0) {
                    this.initProjectile(this.engine, this.yourScore);   
                }
                createRandomProjectile();
            }, interval);
        };
        createRandomProjectile();
        this.engine = engine;
    }

    onActivate(context) {
        console.log("CONTEXT");
        console.log(context);
        this.timeText.time = 20;
        this.yourScore.val = context.data.yourScore;
        this.opponentScore.val = context.data.opponentScore;
  
        let prev = context.data.prevScene;

        setTimeout(() => {
            this.engine.goToScene(prev, {sceneActivationData: {yourScore: this.points, opponentScore: this.opponentPoints, prevScene: null}});
        }, 20000);
    }

    onDeactivate() {
        
    }

    gameHeight = 750;
    gameWidth = 1000;

    initializeBar (game, score) {
        const bar = new Actor({
            x: 100,
            y: this.gameHeight/2,
            color: Color.Red,
            width: 10,
            height: this.gameHeight
        });

        bar.body.collisionType = CollisionType.Fixed;

        let tapped = false;
        let isColliding = false;
        var ball = null;

        game.add(bar);

        game.input.keyboard.on('press', (event) => {
            if(event.key === Keys.E) {
                bar.color = Color.Green;
                tapped = true;
                setTimeout(() => {
                    tapped = false; 
                }, 100);
            }
        });

        bar.on('collisionstart', (evt) => {
            ball = evt.other;
            isColliding = true;
        });

        bar.on('collisionend', (evt) => {
            isColliding = false;
        });

        game.on('postupdate', () => {
            if(isColliding && tapped) {
                if(ball) {
                    ball.kill();
                    this.yourScore.val += 100;
                    //socket.emit(SocketEvents.MY_SCORE_CHANGE, this.yourScore.val)
                    this.yourScore.text.text = 'Score: ' + this.yourScore.val;
                }
            }
        })

        // Timer
        setInterval(() => {
            tapped = false;
            bar.color = Color.Red;
        }, 300);
    }

    initProjectile (game, score) {
        const projectile = new Actor({
            x: this.gameWidth,
            y: Math.max(200, Math.round(Math.random() * 600)),
            radius: 55,
            color: Color.Yellow,
        });

        const projectileSpeed = vec(-600, 0);
        projectile.vel = projectileSpeed;

        projectile.body.collisionType = CollisionType.Passive;

        game.add(projectile);

        projectile.on("postupdate", () => {
            if(projectile.pos.x < -50 || projectile.pos.y < 0 || projectile.pos.x > game.drawWidth || projectile.pos.y > game.drawHeight) {
                projectile.kill();
                if(this.yourScore.val > 0) {
                    this.yourScore.val -= 50
                    socket.emit(SocketEvents.MY_SCORE_CHANGE, this.yourScore.val)
                    this.yourScore.text.text = 'Score: ' + this.yourScore.val;
                }
            }
        });
    }

    initializeText (game) {
        const actor = new Actor({pos: vec(this.gameWidth/2, this.gameHeight-30)});
        const instrText = new Text({
            text: 'Press E when the circle reaches the vertical line.',
            color: Color.White,
            font: new Font({size: 24, textAlign: TextAlign.Left})
        });
        actor.graphics.use(instrText);
        game.currentScene.add(actor);
    }

    initializeTimeText (game) {
        this.timeText = new Actor({pos: vec(this.gameWidth-100, 30)});
        this.timeText.time = 30;
        this.timeText.text = new Text({
            text: 'Time left: ' + this.timeText.time + ' sec',
            color: Color.White,
            font: new Font({size: 14, textAlign: TextAlign.Left})
        });
        this.timeText.graphics.use(this.timeText.text);
        game.currentScene.add(this.timeText);

        setInterval(() => {
            this.timeText.time -= 1;
            if(this.timeText.time >= 0) {
                this.timeText.text.text= 'Time left: ' + this.timeText.time + ' sec';
            }
        }, 1000);
    }

    initializeScore = (game) => {
        const score = new Actor({pos: vec(this.gameWidth/2, 30)});
        score.val = 0;
        score.text = new Text({
            text: 'Score: ' + score.val,
            color: Color.White,
            font: new Font({size: 24, textAlign: TextAlign.Left})
        });
        score.graphics.use(score.text);
        game.currentScene.add(score);
        return score;
    }

    initializeTeamScore = (game) => {
        const opponentScore = new Actor({pos: vec(this.gameWidth/2, 60)});
        opponentScore.val = 0;
        opponentScore.text = new Text({
            text: 'Team Score: ' + opponentScore.val,
            color: Color.White,
            font: new Font({size: 24, textAlign: TextAlign.Left})
        });
        opponentScore.graphics.use(opponentScore.text);
        game.currentScene.add(opponentScore);
        return opponentScore;
    }
}