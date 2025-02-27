class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    this.load.pack("asset_pack", "src/game/assets/imageAssets.json");
    this.load.json("animations_json", "src/game/assets/animations.json");
    this.load.tilemapTiledJSON("map", "src/game/assets/map.json");
  }

  create() {
    this.createAnimations();
    this.scene.start("GameScene");
  }

  createAnimations() {
    const data = this.cache.json.get("animations_json");

    data.forEach((anim) => {
      const frames = anim.frames
        ? this.anims.generateFrameNumbers(anim.assetKey, {
            frames: anim.frames,
          })
        : this.anims.generateFrameNumbers(anim.assetKey);
      this.anims.create({
        key: anim.key,
        frames: frames,
        frameRate: anim.frameRate,
        repeat: anim.repeat,
      });
    });
  }
}

export default PreloadScene;
