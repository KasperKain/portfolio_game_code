import debugInfo from "../global/debugInfo";
import InputManager from "../managers/InputManager";
import PathfindingManager from "../managers/PathFindingManager";
import UIEffects from "../ui/UIEffects";
import DialogueBox from "../ui/DialogueBox";
import Player from "../objects/Player";
import StaticObject from "../objects/StaticObject";
import interactionManager from "../managers/interactionManager";

class GameScene extends Phaser.Scene {
  private player!: Player;
  private closet!: StaticObject;
  private pathFindingManager!: PathfindingManager;
  private dialogueBox!: DialogueBox;
  private inputManager!: InputManager;
  private uiEffects!: UIEffects;
  private map!: Phaser.Tilemaps.Tilemap;
  private backgroundLayer!: Phaser.Tilemaps.TilemapLayer;
  private interactiveLayer!: Phaser.Tilemaps.TilemapLayer;
  private objectLayer!: Phaser.Tilemaps.ObjectLayer;
  public playerIsInteracting: boolean = false;
  buttonClickSound!:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;
  textPromptSound!:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;

  constructor() {
    super({ key: "GameScene" });
  }

  create() {
    this.initializeMap();
    this.initializeLayers();
    this.setupDebugToggle();
    this.initializeComponents();
    console.log(StaticObject.staticObjects);
    this.buttonClickSound = this.sound.add("click");
    this.textPromptSound = this.sound.add("text");
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

    this.interactiveLayer.setVisible(false);
  }

  private setupDebugToggle() {
    this.input.keyboard?.on("keydown-D", () => {
      debugInfo.hidden = !debugInfo.hidden;
      this.toggleLayerVisibility();
    });

    this.input.keyboard?.on("keydown-G", () => {
      this.dialogueBox.showDialogue(
        "Hello world! This is a test",
        this.textPromptSound
      );
    });
  }

  private toggleLayerVisibility() {
    this.interactiveLayer.setVisible(!this.interactiveLayer.visible);
    this.backgroundLayer.setVisible(!this.backgroundLayer.visible);
    this.objectLayer.visible = !this.objectLayer.visible;
    this.closet.interact(() => {
      console.log("doing a thing");
    });
  }

  private initializeComponents() {
    console.log(this);
    this.inputManager = new InputManager(this);
    this.dialogueBox = new DialogueBox(this, { x: 120, y: 50 });
    this.player = new Player(this, { x: 5, y: 5 }, "player");
    this.obj1 = new StaticObject(
      this,
      { x: 1, y: 10 },
      "testOBJ",
      "playerIdleDown",
      "playerIdleUp"
    );

    this.obj2 = new StaticObject(
      this,
      { x: 2, y: 2 },
      "testOBJ",
      "playerIdleDown",
      "playerIdleUp"
    );
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
    this.obj1.update();
  }

  private handlePlayerInteraction() {
    let interactKey = -1;
    if (this.inputManager.getKey("clicked")) {
      this.buttonClickSound.play();
      const pointer = this.input.activePointer;
      const tile = this.getTileFromPointer(pointer);
      const start = this.getPlayerTile();

      const clickedObject = this.getClickedObject(pointer);
      if (clickedObject) {
        interactKey = this.getInteractKey(clickedObject);
        if (interactKey !== undefined) {
          const preferTile = this.findPreferTile(interactKey);
          if (preferTile) {
            tile.x = preferTile.x;
            tile.y = preferTile.y;
          }
        }
      }
      interactionManager.interactionKey = interactKey;
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
      (prop: { name: string }) => prop.name === "interactKey"
    );
    return interactKeyProperty ? interactKeyProperty.value : undefined;
  }

  private findPreferTile(interactKey: number) {
    for (const object of this.objectLayer.objects) {
      const properties = object.properties;
      const interactKeyProperty = properties.find(
        (prop: { name: string }) => prop.name === "interactKey"
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
