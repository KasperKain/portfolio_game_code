class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    this.load.image("tiles", "src/game/assets/images/tilemap.png");
    this.load.pack("asset_pack", "src/game/assets/imageAssets.json");
    this.load.tilemapTiledJSON("map", "src/game/assets/map.json");
  }

  create() {
    this.scene.start("GameScene");
  }
}

export default PreloadScene;
