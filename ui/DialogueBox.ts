// CURRENTLY NOT IMPLEMENTED / REMOVED FOR DEBUGGING REASONS

export default class DialogueBox {
  protected scene: Phaser.Scene;
  protected size: { x: number; y: number };
  protected panel: Phaser.GameObjects.Rectangle;
  protected text: Phaser.GameObjects.Text;
  protected button: Phaser.GameObjects.Text;
  protected isDisplayingText: boolean = false;

  constructor(scene: Phaser.Scene, size: { x: number; y: number }) {
    this.scene = scene;
    this.size = size;
    this.text = "";

    this.panel = this.scene.add
      .rectangle(
        this.scene.cameras.main.width / 2,
        this.scene.cameras.main.height - this.size.y,
        this.size.x,
        this.size.y + 20,
        0x000000
      )
      .setDepth(10)
      .setVisible(false);

    this.text = this.scene.add
      .text(
        this.scene.cameras.main.width / 2,
        this.scene.cameras.main.height - this.size.y,
        "",
        {
          fontFamily: "Courier New",
          fontSize: "11px",
          color: "#ffffff",
          align: "left",
          wordWrap: { width: this.size.x - 20 },
        }
      )
      .setOrigin(0.5)
      .setDepth(10)
      .setVisible(false);

    this.button = this.scene.add
      .text(
        this.scene.cameras.main.width / 2,
        this.scene.cameras.main.height - 85,
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
      .setDepth(100)
      .setVisible(false)
      .setInteractive();

    this.button.on("pointerdown", (event) => {
      this.hideDialogue();
      event.stopPropagation();
    });
  }

  showDialogue(dialogueText: string, sound) {
    //this.text.setText(dialogueText);
    if (!this.isDisplayingText) {
      this.isDisplayingText = true;
      this.typewritePrompt(dialogueText, sound);
      this.panel.setVisible(true);
      this.text.setVisible(true);
      //this.button.setVisible(true);
    }
  }

  hideDialogue() {
    this.text.setText("");
    this.panel.setVisible(false);
    this.text.setVisible(false);
    this.button.setVisible(false);
  }

  typewritePrompt(text, sound) {
    let textTotal = "";
    const charLength = text.length;
    let i = 0;
    this.scene.time.addEvent({
      callback: () => {
        sound.play();
        textTotal += text[i];
        this.text.setText(textTotal);
        console.log("ok");
        i++;
        if (textTotal.length >= charLength) {
          this.isDisplayingText = false;
          this.button.setVisible(true);
        }
      },
      repeat: charLength - 1,
      delay: 80,
    });
  }
}
