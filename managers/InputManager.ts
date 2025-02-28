export default class InputManager {
  public static clickLocked = false;
  private cursorKeys: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private controls: { [key: string]: boolean } = {
    upPressed: false,
    downPressed: false,
    leftPressed: false,
    rightPressed: false,
    clicked: false,
  };

  constructor(scene: Phaser.Scene) {
    this.cursorKeys = scene.input.keyboard!.createCursorKeys();

    scene.input.on("pointerdown", () => {
      if (!InputManager.clickLocked) this.controls.clicked = true;
    });
  }

  getKey(keyName: string): boolean {
    return this.controls[keyName];
  }

  update(): void {
    this.controls.upPressed = this.cursorKeys.up.isDown;
    this.controls.downPressed = this.cursorKeys.down.isDown;
    this.controls.leftPressed = this.cursorKeys.left.isDown;
    this.controls.rightPressed = this.cursorKeys.right.isDown;

    this.controls.clicked = false;
  }
}
