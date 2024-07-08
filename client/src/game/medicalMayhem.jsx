// import { BoundingBox, CollisionType, Engine, Vector, vec } from "excalibur";
import { MedicationMatchingScene } from "./scenes/MedicationMatchingScene";
import { HeartbeatRhythmScene } from "./scenes/HeartbeatRhythmScene";
import { GameResultsScene } from "./scenes/GameResultsScene"
// import { GameResultsScene } from "./scenes/GameResultsScene";
// import { Loader, DisplayMode, Camera } from "excalibur";
// import { TiledResource } from "@excaliburjs/plugin-tiled";
// import map from './Level_1.tmx'
// import Player from "./actors/player";
// import { Resources, loader } from "./resources";
// import Patient from "./actors/patient";
// import * as ex from 'excalibur'

import { BoundingBox, Engine, } from "excalibur";
import { DisplayMode, Camera } from "excalibur";
import Player from "./actors/player";
import { Resources, loader } from "./resources";
import Patient from "./actors/patient";
import { MedicalMayhemScene } from "./scenes/MedicalMayhemScene";

// const gameWidth = 1820;
// const gameHeight = 950;
// const timer = new Timer({
//     interval: 1000,
//     fcn: () => {
//       timerSec--;
//       timerText.text = "Timer: " + timerSec;
//     },
//     repeats: true
//   })

export const MedicalMayhem = (gameRef, gameCanvasRef, players, username) => {

    if (!gameCanvasRef.current) return;

    gameRef.current = new Engine({
        canvasElement: gameCanvasRef.current,
        width: window.innerWidth,
        height: window.innerHeight,
        displayMode: DisplayMode.FullScreen,
        suppressPlayButton: true,
    });
    const engine = gameRef.current;

    console.log(players)
    console.log(username)
    
    
    let medicalMayhemScene = engine.add("medicalMayhem", new MedicalMayhemScene());
    engine.add("heartbeatrhythm", new HeartbeatRhythmScene());
    engine.add("medicationmatching", new MedicationMatchingScene());
    engine.goToScene("medicalMayhem");
    engine.add("gameresults", new GameResultsScene());

    // let gameSequence = ["heartbeatrhythm", "medicationmatching", "heartbeatrhythm", "gameresults"];

    // engine.goToScene(gameSequence[0], {sceneActivationData: {yourScore: 0, opponentScore: 0, games: gameSequence}});

    engine.start(loader).then(() => {
        Resources.tiledMap.addToScene(engine.currentScene)
    
        for (let i in players) {
            let player
    
            if (players[i] === username) {
                player = new Player(players[i], true)
                engine.currentScene.camera.strategy.lockToActor(player)
                engine.currentScene.camera.zoom = 2.5
                engine.currentScene.camera.strategy.limitCameraBounds(new BoundingBox(0, 8, 985, 640))
            }
            else player = new Player(players[i])
    
            engine.currentScene.add(player)
        }
    });

  };