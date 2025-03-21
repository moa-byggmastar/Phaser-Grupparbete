import Phaser from 'phaser';
import Text from './text';

export default class Button extends Phaser.GameObjects.Container {
    private color: number;
    private hoverColor: number;
    private callback: () => void;
    private background: Phaser.GameObjects.Rectangle;
    private label: Text;

    constructor(
        scene: Phaser.Scene,
        text: string,
        x: number,
        y: number,
        width: number,
        height: number,
        callback: () => void
    ) {
        super(scene, x, y);

        this.color = 0xff9933;
        this.hoverColor = 0xffff00;
        this.callback = callback;

        this.background = scene.add.rectangle(0, 0, width, height, this.color);
        this.background.setOrigin(0.5);
        this.add(this.background);

        this.label = new Text(scene, 0, 0, text, 28, 'black');
        this.add(this.label);

        this.background.setInteractive();

        scene.add.existing(this);

        this.background.scrollFactorX = 0;
        this.background.scrollFactorY = 0;
        this.background.on('pointerover', this.onHover, this);
        this.background.on('pointerout', this.onOut, this);
        this.background.on('pointerup', this.onClick, this);
    }

    private onHover() {
        this.background.setFillStyle(this.hoverColor);
    }

    private onOut() {
        this.background.setFillStyle(this.color);
    }

    private onClick() {
        if (this.callback) {
            this.callback();
        }
    }
}
