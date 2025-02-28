import GameObject, { STATES } from "./GameObject";

export default class StaticObject extends GameObject {
  public static staticObjects: StaticObject[] = [];
  private lastState = this.state;
  private idleAnimKey!: string;
  private interactAnimKey!: string;
  constructor(
    scene: Phaser.Scene,
    position = { x: 0, y: 0 },
    textureKey = "testOBJ",
    idleAnimKey: string,
    interactAnimKey: string
  ) {
    super(scene, position, textureKey);
    this.state = STATES.IDLE;
    this.idleAnimKey = idleAnimKey;
    this.interactAnimKey = interactAnimKey;
    this.playAnim(idleAnimKey);
    this.key = StaticObject.staticObjects.length;
    StaticObject.staticObjects.push(this);
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

  interact(action: (onComplete: () => void) => void) {
    if (this.state === STATES.IDLE) this.state = STATES.INTERACTING;
    this.state = STATES.INTERACTING;

    action(() => {
      this.state = STATES.IDLE;
      console.log("interaction complete");
    });

    console.log("interaction started");
  }
}
