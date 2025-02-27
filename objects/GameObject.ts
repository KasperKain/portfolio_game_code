import Phaser from "phaser";

export enum STATES {
  IDLE = "idle",
  MOVING = "moving",
  INTERACTING = "interacting",
}

export default class GameObject extends Phaser.GameObjects.Sprite {
  public state: STATES = STATES.IDLE;

  constructor(
    public scene: Phaser.Scene,
    position: { x: number; y: number },
    textureKey: string
  ) {
    super(scene, position.x, position.y, textureKey);
    scene.add.existing(this);
    this.scale = 1;
    scene.physics.world.enable(this);
    this.setOrigin(0, 0);
  }

  setState(newState: STATES) {
    this.state = newState;
  }
  playAnim(key: string) {
    this.play(key);
  }
}
