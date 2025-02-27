// CURRENTLY NOT IMPLEMENTED / REMOVED FOR DEBUGGING REASONS

export default class DialogueBox {
  protected scene: Phaser.Scene;
  protected size: { x: number; y: number };
  protected panel: Phaser.GameObjects.Rectangle;
  protected text: Phaser.GameObjects.Text;
  protected button: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, size: { x: number; y: number }) {
    this.scene = scene;
    this.size = size;

    this.panel = this.scene.add
      .rectangle(
        this.scene.cameras.main.width / 2,
        this.scene.cameras.main.height - this.size.y,
        this.size.x,
        this.size.y,
        0x000000
      )
      .setDepth(5)
      .setVisible(false);

    this.text = this.scene.add
      .text(
        this.scene.cameras.main.width / 2,
        this.scene.cameras.main.height - this.size.y,
        "",
        {
          fontSize: "11px",
          color: "#ffffff",
          align: "center",
          wordWrap: { width: this.size.x - 20 },
        }
      )
      .setOrigin(0.5)
      .setDepth(10)
      .setVisible(false);

    this.button = this.scene.add
      .text(
        this.scene.cameras.main.width / 2,
        this.scene.cameras.main.height - 80,
        "OK",
        {
          fontSize: "13px",
          fontFamily: "monospace",
          color: "#ffffff",
          backgroundColor: "#444444",
          padding: { left: 5, right: 5, top: 3, bottom: 3 },
        }
      )
      .setOrigin(0.5)
      .setDepth(6)
      .setVisible(false)
      .setInteractive();

    this.button.on("pointerdown", (event) => {
      this.hideDialogue();
      event.stopPropagation();
    });
  }

  showDialogue(dialogueText: string) {
    this.text.setText(dialogueText);
    this.panel.setVisible(true);
    this.text.setVisible(true);
    this.button.setVisible(true);
  }

  hideDialogue() {
    this.panel.setVisible(false);
    this.text.setVisible(false);
    this.button.setVisible(false);
  }
}
