import { DialogueBox } from "../ui/DialogueBox";

class Player extends Phaser.GameObjects.Sprite {
  protected velocity: number = 400;
  protected targetTile;
  isWalking: any;
  constructor(
    public scene: Phaser.Scene,
    position: { x: number; y: number },

    textureKey: string,
    isWalking: boolean = false
  ) {
    super(scene, position.x, position.y, textureKey);
    scene.add.existing(this);
    this.scale = 1;
    scene.physics.world.enable(this);
    this.setOrigin(0, 0);
  }

  update(delta: number, dialogueBox: DialogueBox, isInteracting: boolean) {
    this.checkIsWalking(dialogueBox, isInteracting);
  }

  checkIsWalking(dialogueBox, isInteracting) {
    if (this.isWalking) {
      if (
        this.x / 16 === this.targetTile.x &&
        this.y / 16 === this.targetTile.y
      ) {
        console.log("done");
        console.log(isInteracting);
        if (isInteracting) {
          console.log("is interacting");
          dialogueBox.showDialogue("This is an interactable object!");
        }
        this.isWalking = false;
      }
    }
  }

  moveTo(path: { x: number; y: number }[]) {
    if (!this.isWalking) {
      this.isWalking = true;
      const validPath = path.filter((tile) => {
        if (!this.scene.map) {
          console.error("Map is undefined");
          return false;
        }
        const tileAtPosition = this.scene.map.getTileAt(tile.x, tile.y);
        return tileAtPosition && !tileAtPosition.properties.collide;
      });

      if (validPath.length > 0) {
        this.targetTile = validPath[validPath.length - 1];
      }

      const moveNext = (index: number) => {
        if (index >= validPath.length) return;

        const tile = validPath[index];

        this.scene.tweens.add({
          targets: this,
          x: tile.x * 16,
          y: tile.y * 16,
          duration: 100,
          onComplete: () => moveNext(index + 1),
        });
      };

      if (validPath.length > 0) {
        moveNext(0);
      } else {
        console.log("No valid path found.");
      }
    }
  }
}

export default Player;
