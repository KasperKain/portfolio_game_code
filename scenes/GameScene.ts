import debugInfo from "../global/debugInfo";
import InputManager from "../managers/InputManager";
import PathfindingManager from "../managers/PathFindingManager";
import UIEffects from "../ui/UIEffects";
import DialogueBox from "../ui/DialogueBox";
import Player from "../objects/Player";

class GameScene extends Phaser.Scene {
  player!: Player;
  pathFindingManager!: PathfindingManager;
  dialogueBox!: DialogueBox;
  inputManager!: InputManager;
  playerIsInteracting: boolean = false;
  uiEffects!: UIEffects;
  map!: Phaser.Tilemaps.Tilemap;

  constructor() {
    super({ key: "GameScene" });
  }

  create() {
    this.map = this.make.tilemap({
      key: "map",
      tileWidth: 16,
      tileHeight: 16,
    });
    const tileset = this.map.addTilesetImage("tilemap", "tiles");
    this.map.createLayer("Background", tileset!, 0, 0);

    this.inputManager = new InputManager(this);
    this.dialogueBox = new DialogueBox(this, { x: 100, y: 40 });
    this.player = new Player(this, { x: 64, y: 64 }, "testOBJ");
    this.player.depth = 5;
    this.pathFindingManager = new PathfindingManager(this);
    this.uiEffects = new UIEffects(this);
  }

  update(time: number, delta: number): void {
    if (this.inputManager.getKey("clicked")) {
      const pointer = this.input.activePointer;
      const tile = {
        x: Math.floor(pointer.x / 16),
        y: Math.floor(pointer.y / 16),
      };
      const start = {
        x: Math.floor(this.player.x / 16),
        y: Math.floor(this.player.y / 16),
      };

      this.pathFindingManager.startPathFinding(start, tile);
      this.uiEffects.showClickEffect(pointer.x, pointer.y);
    }

    this.inputManager.update();
    this.player.update(delta, this.dialogueBox, this.playerIsInteracting);

    debugInfo.time = this.time.now;
    debugInfo.delta = delta;
    debugInfo.fps = this.game.loop.actualFps;
  }
}

export default GameScene;
