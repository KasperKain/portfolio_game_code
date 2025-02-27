import EasyStar from "easystarjs";
import UIEffects from "../ui/UIEffects";

export default class PathfindingManager {
  private finder: EasyStar.js;
  private walkable: number[];
  private uiEffects: UIEffects;
  private map: Phaser.Tilemaps.Tilemap;
  private interactiveLayer: Phaser.Tilemaps.TilemapLayer;

  constructor(
    private scene: Phaser.Scene,
    map: Phaser.Tilemaps.Tilemap,
    interactiveLayer: Phaser.Tilemaps.TilemapLayer
  ) {
    this.finder = new EasyStar.js();
    this.walkable = [];
    this.map = map;
    this.interactiveLayer = interactiveLayer;
    this.setupGrid();
    this.uiEffects = new UIEffects(scene);
  }

  private setupGrid() {
    const grid: number[][] = [];

    for (let y = 0; y < this.map.height; y++) {
      const row: number[] = [];
      for (let x = 0; x < this.map.width; x++) {
        const tile = this.interactiveLayer.getTileAt(x, y);
        row.push(tile!.index);
        if (!tile!.properties.collide) {
          this.walkable.push(tile!.index);
        }
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
    const targetTile = this.interactiveLayer.getTileAt(end.x, end.y);
    this.scene.playerIsInteracting = false;

    if (targetTile?.properties.interact) {
      this.scene.playerIsInteracting = true;
      const interactKey = targetTile.properties.interactKey;

      if (interactKey !== undefined) {
        end = this.findPreferTile(interactKey) || end;
      }
    }

    if (targetTile?.properties.collide) {
      end = this.findNearestWalkableTile(end) || end;
    }

    this.finder.findPath(start.x, start.y, end.x, end.y, (path) => {
      if (!path || path.length === 0) {
        console.log("No valid path found.");
        return;
      }

      this.uiEffects.showGlowEffect(end.x * 16 + 8, end.y * 16 + 8);
      this.scene.player.moveTo(path);
    });

    this.finder.calculate();
  }

  private findPreferTile(interactKey: number) {
    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        const tile = this.interactiveLayer.getTileAt(x, y);
        if (
          tile?.properties.prefer &&
          tile.properties.interactKey === interactKey
        ) {
          return { x, y };
        }
      }
    }
    return null;
  }

  private findNearestWalkableTile(end: {
    x: number;
    y: number;
  }): { x: number; y: number } | null {
    const queue = [end];
    const visited = new Set([`${end.x},${end.y}`]);

    while (queue.length > 0) {
      const { x, y } = queue.shift()!;
      const tile = this.interactiveLayer.getTileAt(x, y);

      if (tile && !tile.properties.collide) {
        return { x, y };
      }

      // Check neighbors
      for (const neighbor of this.getNeighbors(x, y)) {
        const key = `${neighbor.x},${neighbor.y}`;
        if (
          !visited.has(key) &&
          this.interactiveLayer.getTileAt(neighbor.x, neighbor.y)
        ) {
          queue.push(neighbor);
          visited.add(key);
        }
      }
    }

    return null; // No walkable tile found
  }

  private getNeighbors(x: number, y: number) {
    return [
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y + 1 },
      { x, y: y - 1 },
    ];
  }
}
