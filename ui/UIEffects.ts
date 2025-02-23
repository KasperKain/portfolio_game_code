export default class UIEffects {
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  showClickEffect(x: number, y: number) {
    const clicked = this.scene.add
      .sprite(x, y, "click")
      .setAlpha(0)
      .setScale(2);

    this.scene.tweens.add({
      targets: clicked,
      alpha: 0.9,
      duration: 20,
      onComplete: () => {
        this.scene.tweens.add({
          targets: clicked,
          alpha: 0,
          duration: 150,
          onComplete: () => clicked.destroy(),
        });
      },
    });
  }

  showGlowEffect(x: number, y: number) {
    const glow = this.scene.add.sprite(x, y, "glow").setAlpha(0).setScale(1);

    this.scene.tweens.add({
      targets: glow,
      alpha: 0.2,
      duration: 100,
      onComplete: () => {
        this.scene.tweens.add({
          targets: glow,
          alpha: 0,
          duration: 500,
          onComplete: () => glow.destroy(),
        });
      },
    });
  }
}
