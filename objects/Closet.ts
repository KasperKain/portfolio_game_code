import GameObject, { STATES } from "./GameObject";

export default class Closest extends GameObject {
  private lastState = this.state;
  private idleAnimKey: string;
  private interactAnimKey: string;
  constructor(
    scene,
    position = { x: 0, y: 0 },
    textureKey = "testOBJ",
    idleAnimKey: String,
    interactAnimKey: String
  ) {
    super(scene, position, textureKey);
    this.state = STATES.IDLE;
  }

  update() {
    if (this.state !== this.lastState) {
      console.log("changing state");
      this.lastState = this.state;

      if (this.state === STATES.IDLE) {
        this.playAnim(this.idleAnimKey);
      }

      if (this.state === STATES.INTERACTING) {
        this.playAnim(this.interactAnimKey);
      }
    }
  }

  interact(callback: Function) {
    callback().then(console.log("done"));
  }
}
