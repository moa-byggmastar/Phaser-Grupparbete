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
        const titleText = new Text(this, Number(this.game.config.width) / 2, Number(this.game.config.height) / 4, 'PyreBound', 80)
        titleText.setOrigin(0.5)

        new Button(this, 'Start game', Number(this.game.config.width) / 2, Number(this.game.config.height) / 2, 160, 60, () => {
            this.scene.start('gamescene')
        })

    };

    //@ts-ignore
    update(time: number, delta: number): void {
    
    };

};