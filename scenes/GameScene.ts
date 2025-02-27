import debugInfo from "../global/debugInfo";
import InputManager from "../managers/InputManager";
import PathfindingManager from "../managers/PathFindingManager";
import UIEffects from "../ui/UIEffects";
import DialogueBox from "../ui/DialogueBox";
import Player from "../objects/Player";

class GameScene extends Phaser.Scene {
  private player!: Player;
  private pathFindingManager!: PathfindingManager;
  private dialogueBox!: DialogueBox;
  private inputManager!: InputManager;
  private uiEffects!: UIEffects;
  private map!: Phaser.Tilemaps.Tilemap;
  private backgroundLayer!: Phaser.Tilemaps.TilemapLayer;
  private interactiveLayer!: Phaser.Tilemaps.TilemapLayer;
  private objectLayer!: Phaser.Tilemaps.ObjectLayer;
  public playerIsInteracting: boolean = false;

  constructor() {
    super({ key: "GameScene" });
  }

  create() {
    this.initializeMap();
    this.initializeLayers();
    this.setupDebugToggle();
    this.initializeComponents();
  }

  private initializeMap() {
    this.map = this.make.tilemap({
      key: "map",
      tileWidth: 16,
      tileHeight: 16,
    });
  }

  private initializeLayers() {
    const backgroundTileset = this.map.addTilesetImage(
      "tilemap",
      "backgroundTilemap"
    );
    const interactiveTileset = this.map.addTilesetImage(
      "debugTilemap",
      "interactiveTilemap"
    );

    this.backgroundLayer = this.map.createLayer(
      "Background",
      backgroundTileset!,
      0,
      0
    );
    this.interactiveLayer = this.map.createLayer(
      "Interactive",
      interactiveTileset!,
      0,
      0
    );
    this.objectLayer = this.map.getObjectLayer("Objects");

    console.log(this.objectLayer);
    this.interactiveLayer.setVisible(false);
  }

  private setupDebugToggle() {
    this.input.keyboard?.on("keydown-D", () => {
      debugInfo.hidden = !debugInfo.hidden;
      this.toggleLayerVisibility();
    });
  }

  private toggleLayerVisibility() {
    this.interactiveLayer.setVisible(!this.interactiveLayer.visible);
    this.backgroundLayer.setVisible(!this.backgroundLayer.visible);
    this.objectLayer.visible = !this.objectLayer.visible;
  }

  private initializeComponents() {
    this.inputManager = new InputManager(this);
    this.dialogueBox = new DialogueBox(this, { x: 100, y: 40 });
    this.player = new Player(this, { x: 64, y: 64 }, "player");
    this.player.playAnim("playerIdleDown");
    this.player.depth = 5;
    this.pathFindingManager = new PathfindingManager(
      this,
      this.map,
      this.interactiveLayer
    );
    this.uiEffects = new UIEffects(this);
  }

  update(time: number, delta: number): void {
    this.handlePlayerInteraction();
    this.inputManager.update();
    this.player.update(delta, this.dialogueBox, this.playerIsInteracting);
    this.updateDebugInfo(delta);
  }

  private handlePlayerInteraction() {
    if (this.inputManager.getKey("clicked")) {
      const pointer = this.input.activePointer;
      const tile = this.getTileFromPointer(pointer);
      const start = this.getPlayerTile();

      const clickedObject = this.getClickedObject(pointer);
      if (clickedObject) {
        const interactKey = this.getInteractKey(clickedObject);
        if (interactKey !== undefined) {
          const preferTile = this.findPreferTile(interactKey);
          if (preferTile) {
            tile.x = preferTile.x;
            tile.y = preferTile.y;
          }
        }
      }

      this.pathFindingManager.startPathFinding(start, tile);
      this.uiEffects.showClickEffect(pointer.x, pointer.y);
    }
  }

  private getTileFromPointer(pointer: Phaser.Input.Pointer) {
    return {
      x: Math.floor(pointer.x / 16),
      y: Math.floor(pointer.y / 16),
    };
  }

  private getPlayerTile() {
    return {
      x: Math.floor(this.player.x / 16),
      y: Math.floor(this.player.y / 16),
    };
  }

  private getClickedObject(pointer: Phaser.Input.Pointer) {
    return this.objectLayer.objects.find(
      (obj) =>
        pointer.x >= obj.x &&
        pointer.x < obj.x + 16 &&
        pointer.y >= obj.y - 16 &&
        pointer.y < obj.y
    );
  }

  private getInteractKey(clickedObject: any) {
    const properties = clickedObject.properties;
    const interactKeyProperty = properties.find(
      (prop) => prop.name === "interactKey"
    );
    return interactKeyProperty ? interactKeyProperty.value : undefined;
  }

  private findPreferTile(interactKey: number) {
    for (const object of this.objectLayer.objects) {
      const properties = object.properties;
      const interactKeyProperty = properties.find(
        (prop) => prop.name === "interactKey"
      );
      const preferProperty = properties.find((prop) => prop.name === "prefer");

      if (
        interactKeyProperty &&
        preferProperty &&
        interactKeyProperty.value === interactKey
      ) {
        return { x: object.x / 16, y: object.y / 16 }; // Return the coordinates of the prefer tile
      }
    }
    return null; // No matching prefer tile found
  }

  private updateDebugInfo(delta: number) {
    debugInfo.time = this.time.now;
    debugInfo.delta = delta;
    debugInfo.fps = this.game.loop.actualFps;
  }
}

export default GameScene;
