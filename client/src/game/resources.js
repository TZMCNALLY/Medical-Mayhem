import { TiledResource } from "@excaliburjs/plugin-tiled";
import { ImageSource, Loader } from "excalibur";
import Player from "./actors/player";
import map from './Level_1.tmx'
import Patient from "./actors/patient";

export const Resources = {
    PlayerPng: new ImageSource('/static/media/Player-1.png'),
    PatientPng: new ImageSource('/static/media/Player-2-2.png'),
    tiledMap: new TiledResource(map, {
        entityClassNameFactories: {
            player: (props) => {
                const player = new Player();
                player.z = 100;
                return player;
            },
            patient: (props) => {
                const patient = new Patient();
                patient.z = 100;
                return patient;
            },
        },
    }),
}

export const loader = new Loader()
for (let resource of Object.values(Resources))
    loader.addResource(resource)