/**
 * Game results
 */

// import { Actor, Color, CollisionType, vec, Keys, Text, Font, TextAlign, Scene } from "excalibur";
import { Actor, Color, vec, Text, Font, TextAlign, Scene } from "excalibur";

export class GameResultsScene extends Scene {

    onInitialize(engine) {
        console.log("STARTING RESULTS SCREEN");
        this.engine = engine;
        this.initializeText(engine);
        this.yourScore = this.initializeScore(this.engine);
        this.opponentScore = this.initializeOpponentScore(this.engine);
    }

    yourScore;
    opponentScore;
    engine;
    gameWidth = 1000;
    gameHeight = 750;

    onActivate(context) {
        console.log(context);
        this.yourScore.val = context.data.yourScore;
        this.opponentScore.val = context.data.opponentScore;
        this.yourScore.text.text = 'Score: ' + this.yourScore.val;
        this.opponentScore.text.text = 'Opponent Score: ' + this.opponentScore.val;

        // SEND GAME DATA TO DB
    }

    onDeactivate() {
        
    }

    initializeText (game) {
        const actor = new Actor({pos: vec(this.gameWidth/2, this.gameHeight/2-40)});
        const instrText = new Text({
            text: 'Game over!',
            color: Color.White,
            font: new Font({size: 80, textAlign: TextAlign.Left})
        });
        actor.graphics.use(instrText);
        game.currentScene.add(actor);
    }

    initializeScore = (game) => {
        const score = new Actor({pos: vec(this.gameWidth/2, this.gameHeight/2 + 50)});
        score.val = 0;
        score.text = new Text({
            text: 'Score: ' + score.val,
            color: Color.White,
            font: new Font({size: 30, textAlign: TextAlign.Left})
        });
        score.graphics.use(score.text);
        game.currentScene.add(score);
        return score;
    }

    initializeOpponentScore = (game) => {
        const opponentScore = new Actor({pos: vec(this.gameWidth/2, this.gameHeight/2 + 85)});
        opponentScore.val = 0;
        opponentScore.text = new Text({
            text: 'Opponent Score: ' + opponentScore.val,
            color: Color.White,
            font: new Font({size: 30, textAlign: TextAlign.Left})
        });
        opponentScore.graphics.use(opponentScore.text);
        game.currentScene.add(opponentScore);
        return opponentScore;
    }

}