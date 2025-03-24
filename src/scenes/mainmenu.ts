import Phaser from "phaser";
import Text from "../graphics/text";
import Button from "../graphics/button";

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('mainmenuscene');
    };

    preload() {
        this.load.image('pointer', 'src/assets/pointer.png')
    };

    create() {
        this.input.setDefaultCursor('none');
        const customCursor = this.add.image(0, 0, 'pointer').setDepth(2).setScale(2);

        // Make the custom cursor follow the mouse
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            customCursor.setPosition(pointer.x, pointer.y);
        });
        
        new Text(this, Number(this.game.config.width) / 2, Number(this.game.config.height) / 4, 'PyreBound', 80)

        new Button(this, 'START GAME', Number(this.game.config.width) / 2, Number(this.game.config.height) / 2, 160, 60, () => {
            this.scene.start('gamescene')
        })

    };

    //@ts-ignore
    update(time: number, delta: number): void {
    
    };

};