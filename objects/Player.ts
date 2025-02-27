import debugInfo from "../global/debugInfo";
import { DialogueBox } from "../ui/DialogueBox";
import GameObject, { STATES } from "./GameObject";

class Player extends GameObject {
  protected moveDelay: number = 200;
  protected prevPosition = { x: 0, y: 0 };
  protected lastDirection: string = "Down";

  constructor(
    scene: Phaser.Scene,
    position: { x: number; y: number },
    textureKey: string
  ) {
    super(scene, position, textureKey);
    this.prevPosition = { x: position.x, y: position.y };
    this.setOrigin(0.25, 0.5);
  }

  update(delta: number, dialogueBox: DialogueBox, isInteracting: boolean) {
    this.checkIsWalking(dialogueBox, isInteracting);
  }

  private checkIsWalking(dialogueBox: DialogueBox, isInteracting: boolean) {
    if (this.state !== STATES.MOVING) return;

    const reachedTarget =
      this.x / 16 === this.targetTile.x && this.y / 16 === this.targetTile.y;

    if (reachedTarget) {
      this.handleMovementCompletion(dialogueBox, isInteracting);
    }
  }

  moveTo(path: { x: number; y: number }[]) {
    if (this.state === STATES.MOVING) return;

    this.setState(STATES.MOVING);
    const validPath = this.getValidPath(path);

    if (validPath.length === 0) {
      this.setState(STATES.IDLE);
      return;
    }

    this.targetTile = validPath[validPath.length - 1];
    this.followPath(validPath);
  }

  private getValidPath(
    path: { x: number; y: number }[]
  ): { x: number; y: number }[] {
    if (!this.scene.map) {
      console.error("Map is undefined");
      return [];
    }

    return path.filter((tile) => {
      const tileAtPosition = this.scene.map.getTileAt(tile.x, tile.y);
      return tileAtPosition && !tileAtPosition.properties.collide;
    });
  }

  private followPath(path: { x: number; y: number }[], index = 0) {
    if (index >= path.length) {
      this.setState(STATES.IDLE);
      this.playAnimation("playerIdle", this.lastDirection);
      return;
    }

    const tile = path[index];
    const newDirection = this.getMovementDirection(
      this.x,
      this.y,
      tile.x * 16,
      tile.y * 16
    );

    if (newDirection !== this.lastDirection) {
      this.lastDirection = newDirection;
      debugInfo.direction = newDirection;
      this.playAnimation("playerWalk", this.lastDirection);
    }

    this.scene.tweens.add({
      targets: this,
      x: tile.x * 16,
      y: tile.y * 16,
      duration: this.moveDelay,
      onComplete: () => this.followPath(path, index + 1),
    });
  }

  private getMovementDirection(
    prevX: number,
    prevY: number,
    newX: number,
    newY: number
  ): string {
    if (newX > prevX) return "Right";
    if (newX < prevX) return "Left";
    if (newY > prevY) return "Down";
    if (newY < prevY) return "Up";
    return "Down";
  }

  private playAnimation(type: string, direction?: string) {
    this.setFlipX(false);
    let correctedDirection = direction;
    if (direction === "Left") {
      this.setFlipX(true);
      correctedDirection = "Side";
    }
    if (direction === "Right") {
      this.setFlipX(false);
      correctedDirection = "Side";
    }
    const animKey = `${type}${correctedDirection}`;
    this.playAnim(animKey);
  }
}

export default Player;
