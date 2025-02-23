const options = {
  type: Phaser.CANVAS,
  size: { x: 160, y: 240 },
  gravity: { x: 0, y: 0 },
  physicsDebug: true,
};

// Options above

const rootConfig: Phaser.Types.Core.GameConfig = {
  type: options.type,
  width: options.size.x,
  height: options.size.y,
  mode: Phaser.Scale.CENTER_BOTH,
  scale: {
    mode: Phaser.Scale.FIT,
  },
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: options.gravity,
      debug: options.physicsDebug,
    },
  },
};

export default rootConfig;
