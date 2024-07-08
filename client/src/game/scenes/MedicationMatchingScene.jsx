/**
 * Medication Matching:
 * Players will have to match the proper prescription to the patient’s needs.
 * Each patient will have a box that the player has to match the patient’s medication to.
 * The player will have to use their WASD keys and the E key to select the patient’s box
 * and toss in the medication. Alternatively, the mouse and left click can be used to select
 * the patient’s box. Incorrect matching will result in that patient dying. 
 */

import { Actor, Color, vec, Keys, Text, Font, TextAlign, Timer, Scene } from "excalibur";
import socket from "../../constants/socket";
import SocketEvents from "../../constants/socketEvents";

export class MedicationMatchingScene extends Scene {

    onInitialize(engine) {
        console.log("INIT MEDICATION MATCHING");

        this.initializeMeds(engine);
        this.initializeSelector(engine);
        this.initializeCurrColor(engine);
        this.initializeText(engine);
        engine.currentScene.add(this.timer);
        this.timer.start();

        // game?.start().catch((e) => console.error(e));
    }

    points;
    opponentPoints;

    onActivate(context) {
        console.log("CONTEXT");
        console.log(context);
        this.timerSec = 15;
        this.points = context.data.yourScore;
        this.pointText.text = "Score: " + this.points;
        this.opponentPoints = context.data.opponentScore;
        this.opponentPointText.text = "Opponent Score: " + this.opponentPoints;

        console.log(context.data.prevScene);
        let prev = context.data.prevScene;

        setTimeout(() => {
            this.engine.goToScene(prev, {sceneActivationData: {yourScore: this.points, opponentScore: this.opponentPoints, prevScene: null}});
            // socket.emit(SocketEvents.SPAWN_PATIENT, this.points)
        }, 15000);
    }

    onDeactivate() {

    }


    pointText = new Text({
        text: "Score: " + this.points,
        color: Color.White,
        font: new Font({size: 24, textAlign: TextAlign.Left})
    })
    opponentPointText = new Text({
        text: "Opponent Score: " + this.opponentPoints,
        color: Color.White,
        font: new Font({size: 24, textAlign: TextAlign.Left})
    })
    timerSec = 15;
    timerText = new Text({
        text: "Timer: " + this.timerSec,
        color: Color.White,
        font: new Font({size: 24, textAlign: TextAlign.Left})
    })
    timer = new Timer({
        interval: 1000,
        fcn: () => {
            this.timerSec--;
            this.timerText.text = "Timer: " + this.timerSec;
        },
        repeats: true
    })
    row = 0;
    col = 0;
    gameWidth = 1000;
    gameHeight = 750;
    // Pool of possible box colors
    boxColor = [Color.Violet, Color.Orange, Color.Yellow, Color.Viridian, Color.Magenta,
                Color.Green, Color.Gray, Color.Vermilion, Color.Viridian];
    randomColors = []; // Pool of random colors in the current round
    boxesInfo = [];
    currCoords = {};

    initializeMeds = (game) => {
        // Padding between medicines
        const padding = 20; // px
        const xoffset = 65; // x-offset
        const yoffset = 60; // y-offset
        const columns = 5;
        const rows = 3;

        // Individual medicine width with padding factored in
        const boxWidth = this.gameWidth / columns - padding - padding / columns; // px
        const boxHeight = this.gameWidth / columns - padding - padding / columns; // px
        const boxes = [];
        for (let j = 0; j < rows; j++) {
            const colCoords = [];
            for (let i = 0; i < columns; i++) {
                let randomColor = this.boxColor[Math.floor(Math.random() * this.boxColor.length)];
                if(!this.randomColors.includes(randomColor)) this.randomColors.push(randomColor);
                colCoords.push({
                    x: xoffset + i * (boxWidth + padding) + padding,
                    y: yoffset + j * (boxHeight + padding) + padding,
                    color: randomColor
                });
                boxes.push(new Actor({
                    x: colCoords[i].x,
                    y: colCoords[i].y,
                    width: boxWidth,
                    height: boxHeight,
                    color: randomColor
                }));
            }
            this.boxesInfo.push(colCoords);
        }

        boxes.forEach(function (box) {
            game.add(box); // Draw on current scene
        });
        return boxes;
    };
    
    initializeSelector = (game) => {
        // Dimensions and positioning
        const padding = 20; // px
        const xoffset = 65; // x-offset
        const yoffset = 60; // y-offset
        const columns = 5;
        const rows = 3;
        const boxWidth = this.gameWidth / columns - padding - padding / columns; // px
        const boxHeight = this.gameWidth / columns - padding - padding / columns; // px

        // Sides of the selector square
        const selectorSides = [];
        // selectorSides[0] and [2] are horizontal sides, [1] and [3] are vertical
        for(let i = 0; i < 4; i++) {
            selectorSides.push(new Actor({
                x: (i % 2 === 0) ? xoffset + padding : ((i === 1 ? 0 : boxWidth - 6)),
                y: (i % 2 === 0) ? (-7 + (i === 2 ? boxHeight - 4 : 0)) : padding + yoffset,
                width: (i % 2 === 0) ? boxWidth : 5,
                height: (i % 2 === 0) ? 5 : boxHeight,
                color: Color.Red
            }));
        }
        selectorSides.forEach(side => { game.add(side); })
        this.currCoords.x = xoffset + this.col * (boxWidth + padding) + padding;
        this.currCoords.y = yoffset + this.row * (boxHeight + padding) + padding;

        // Selector movement with WASD keys
        game.input.keyboard.on('press', (event) => {
            switch(event.key) {
                case Keys.W:
                    if(this.row !== 0) {
                        this.row--;
                        this.selectorMovement(
                            selectorSides, vec(0, (boxHeight + padding) * -1),
                            boxWidth, boxHeight, padding, xoffset, yoffset
                        );
                    }
                    break;
                case Keys.A:
                    if(this.col !== 0) {
                        this.col--;
                        this.selectorMovement(
                            selectorSides, vec((boxHeight + padding) * -1, 0),
                            boxWidth, boxHeight, padding, xoffset, yoffset
                        );
                    }
                    break;
                case Keys.S:
                    if(this.row !== rows - 1) {
                        this.row++;
                        this.selectorMovement(
                            selectorSides, vec(0, boxHeight + padding),
                            boxWidth, boxHeight, padding, xoffset, yoffset
                        );
                    }
                    break;
                case Keys.D:
                    if(this.col !== columns - 1) {
                        this.col++;
                        this.selectorMovement(
                            selectorSides, vec(boxHeight + padding, 0),
                            boxWidth, boxHeight, padding, xoffset, yoffset
                        );
                    }
                    break;
                default:
                    return;
            }
        })

        return selectorSides;
    }

    initializeCurrColor = (game) => {
        // Pick random color from current round's random colors
        this.currColor = this.randomColors[Math.floor(Math.random() * this.randomColors.length)];
    
        const currColorBorder = new Actor({
            x: this.gameWidth - 100,
            y: this.gameHeight - 70,
            radius: 55,
            color: Color.Red,
        })
        const currColorCircle = new Actor({
            x: this.gameWidth - 100,
            y: this.gameHeight - 70,
            radius: 50,
            color: this.currColor
        })

        game.add(currColorBorder);
        game.add(currColorCircle);
        
        game.input.keyboard.on('press', (event) => {
            if(event.key === Keys.E) {
                // Moves currColor circle to the selected box
                currColorBorder.actions.moveTo(vec(this.currCoords.x, this.currCoords.y), 2000);
                currColorCircle.actions.moveTo(vec(this.currCoords.x, this.currCoords.y), 2000);

                // Check if the player put the medication in the right box
                if(this.currColor === this.boxesInfo[this.row][this.col].color) {
                    this.points += 100;
                    this.pointText.text = "Score: " + this.points;
                    socket.emit(SocketEvents.MY_SCORE_CHANGE, this.points)
                } else {
                    this.points -= 50;
                    this.pointText.text = "Score: " + this.points;
                    socket.emit(SocketEvents.MY_SCORE_CHANGE, this.points)
                }

                // Bring currColor circle back to original position
                currColorBorder.actions.moveTo(vec(this.gameWidth - 100, this.gameHeight - 70), 2000);
                currColorCircle.actions.moveTo(vec(this.gameWidth - 100, this.gameHeight - 70), 2000).callMethod(() => {
                    this.currColor = this.randomColors[Math.floor(Math.random() * this.randomColors.length)];
                    currColorCircle.color = this.currColor;
                });
            }
        })
    }

    initializeText = (game) => {
        const actor1 = new Actor({pos: vec(170, this.gameHeight - 30)});
        const instrText = new Text({
            text: 'WASD keys to select box\nE key to place medicine in box',
            color: Color.White,
            font: new Font({size: 24, textAlign: TextAlign.Left})
        });
        const actor2 = new Actor({pos: vec(60, this.gameHeight - 70)})
        const actor3 = new Actor({pos: vec(110, this.gameHeight - 95)})
        const timeActor = new Actor({pos: vec(55, this.gameHeight - 120)});
        const actors = [{actor: actor1, text: instrText},
            {actor: actor2, text: this.pointText},
            {actor: actor3, text: this.opponentPointText},
            {actor: timeActor, text: this.timerText}
        ];

        actors.forEach((actorObject) => {
            actorObject.actor.graphics.use(actorObject.text);
            game.currentScene.add(actorObject.actor);
        })
    }

    // Helper function for movement of the selector
    selectorMovement(sides, vector, boxWidth, boxHeight, padding, xoffset, yoffset) {
        sides.forEach(side => { side.actions.moveBy(vector, 1500) });
        this.currCoords.x = xoffset + this.col * (boxWidth + padding) + padding;
        this.currCoords.y = yoffset + this.row * (boxHeight + padding) + padding;
    }
}