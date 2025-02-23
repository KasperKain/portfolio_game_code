import EasyStar from "easystarjs";
import UIEffects from "../ui/UIEffects";

export default class PathfindingManager {
  finder: EasyStar.js;
  map: Phaser.Tilemaps.Tilemap;
  walkable: number[];
  uiEffects: UIEffects;

  constructor(private scene: Phaser.Scene, uiEffects: UIEffects) {
    this.finder = new EasyStar.js();
    this.walkable = [];
    this.map = this.scene.make.tilemap({
      key: "map",
      tileWidth: 16,
      tileHeight: 16,
    });
    const tileset = this.map.addTilesetImage("tilemap", "tiles");
    this.map.createLayer("Background", tileset!, 0, 0);
    this.setupGrid();
    this.uiEffects = new UIEffects(scene);
  }

  private setupGrid() {
    const grid: number[][] = [];

    for (let y = 0; y < this.map.height; y++) {
      let row: number[] = [];
      for (let x = 0; x < this.map.width; x++) {
        const tile = this.map.getTileAt(x, y);
        row.push(tile!.index);
        if (!tile!.properties.collide) this.walkable.push(tile!.index);
      }
      grid.push(row);
    }

    this.finder.setGrid(grid);
    this.finder.setAcceptableTiles(this.walkable);
  }

  public startPathFinding(
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) {
    const clickedTile = this.map.getTileAt(end.x, end.y);
    this.scene.playerIsInteracting = false;

    if (clickedTile?.properties.interactable) {
      this.scene.playerIsInteracting = true;

      const neighbors = [
        { x: end.x + 1, y: end.y },
        { x: end.x - 1, y: end.y },
        { x: end.x, y: end.y + 1 },
        { x: end.x, y: end.y - 1 },
      ];

      end =
        neighbors.find((tile) => {
          const mapTile = this.map.getTileAt(tile.x, tile.y);
          return mapTile?.properties.preferred;
        }) || end;
    }

    this.finder.findPath(start.x, start.y, end.x, end.y, (path) => {
      if (!path || this.map.getTileAt(end.x, end.y).properties.collide) {
        console.log("Path not found", end.x + " " + end.y);
        return;
      }

      this.uiEffects.showGlowEffect(end.x * 16 + 8, end.y * 16 + 8);
      this.scene.player.moveTo(path);
    });

    this.finder.calculate();
  }
}
