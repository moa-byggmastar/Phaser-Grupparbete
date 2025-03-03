import './style.css';
import Phaser from 'phaser';
import GameScene from './scenes/gamescene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    parent: 'app',
    scene: [GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 800 },
            debug: false
        }
    },
    antialias: false
};

const game = new Phaser.Game(config);