import './style.css';
import Phaser from 'phaser';
import GameScene from './scenes/gamescene';
import MainMenuScene from './scenes/mainmenu';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    parent: 'app',
    scene: [MainMenuScene, GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 800 },
            debug: false
        }
    },
    antialias: false,
    roundPixels: true
};

// @ts-ignore
const game = new Phaser.Game(config);