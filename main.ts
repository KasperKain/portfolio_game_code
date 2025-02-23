import Phaser from "phaser";
import rootConfig from "./rootConfig";
import GameScene from "./scenes/GameScene";
import PreloadScene from "./scenes/PreloadScene";

export const createGame = (parentID: string) => {
  const parent = document.querySelector(`#${parentID}`);
  if (!parent) return;
  const game = new Phaser.Game({
    ...rootConfig,
    parent: parent as HTMLElement,
  });

  game.scene.add("PreloadScene", PreloadScene);
  game.scene.add("GameScene", GameScene);
  game.scene.start("PreloadScene");
  return game;
};
