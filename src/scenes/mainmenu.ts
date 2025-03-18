import Phaser from "phaser";
import Text from "../graphics/text";
import Button from "../graphics/button";

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('mainmenuscene');
    };

    preload() {

    };

    create() {
        new Text(this, Number(this.game.config.width) / 2, 100, 'PyreBound', 60)

        new Button(this, 'Start game', Number(this.game.config.width) / 2, 200, 160, 60, () => {
            this.scene.start('gamescene')
        })

    };

    //@ts-ignore
    update(time: number, delta: number): void {
    
    };

};