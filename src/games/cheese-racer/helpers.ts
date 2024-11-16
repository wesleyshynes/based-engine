type Tile = 'road' | 'building';
export class TileGrid {
    grid: Tile[][];
    rows: number;
    cols: number;
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;

    buildings: { row: number, col: number, width: number, height: number }[] = [];

    constructor(
        rows: number,
        cols: number,
        minWidth: number = 5,
        maxWidth: number = 10,
        minHeight: number = 3,
        maxHeight: number = 6
    ) {
        this.rows = rows;
        this.cols = cols;
        this.minWidth = minWidth;
        this.maxWidth = maxWidth;
        this.minHeight = minHeight;
        this.maxHeight = maxHeight;
        this.grid = Array.from({ length: rows }, () => Array(cols).fill('road'));
    }

    // Check if a building can be placed at a given position and size
    canPlaceBuilding(row: number, col: number, width: number, height: number): boolean {
        for (let r = row - 2; r <= row + height + 1; r++) {
            for (let c = col - 2; c <= col + width + 1; c++) {
                if (
                    r >= 0 &&
                    r < this.rows &&
                    c >= 0 &&
                    c < this.cols &&
                    this.grid[r]?.[c] === 'building'
                ) {
                    return false; // Another building is too close
                }
            }
        }
        return true;
    }

    // Place a building at a valid position and size
    placeBuilding(row: number, col: number, width: number, height: number): boolean {
        if (
            row + height <= this.rows - 2 &&
            col + width <= this.cols - 2 &&
            this.canPlaceBuilding(row, col, width, height)
        ) {
            for (let r = row; r < row + height; r++) {
                for (let c = col; c < col + width; c++) {
                    this.grid[r][c] = 'building';
                }
            }
            this.buildings.push({ row, col, width, height });
            return true;
        }
        return false;
    }

    // Generate the grid with buildings
    generate(buildingCount: number = 0): void {
        let placedBuildings = 0;
        let attempts = 0; // To avoid infinite loops

        if(buildingCount > 0) {
            while (buildingCount === undefined || placedBuildings < buildingCount) {
                const row = Math.floor(Math.random() * (this.rows - 2)) + 2;
                const col = Math.floor(Math.random() * (this.cols - 2)) + 2;
    
                const width = Math.floor(Math.random() * (this.maxWidth - this.minWidth + 1)) + this.minWidth;
                const height = Math.floor(Math.random() * (this.maxHeight - this.minHeight + 1)) + this.minHeight;
    
                if (this.placeBuilding(row, col, width, height)) {
                    placedBuildings++;
                    attempts = 0; // Reset attempts on successful placement
                } else {
                    attempts++;
                    if (attempts > 1000) {
                        // Stop if too many failed attempts (indicates no more room)
                        break;
                    }
                }
            }
        }

        for (let r = 2; r < this.rows - 2; r++) {
            for (let c = 2; c < this.cols - 2; c++) {
                // this.grid[r][c] = 'road';
                attempts = 0
                while (true) {
                    const row = r;
                    const col = c;
        
                    const width = Math.floor(Math.random() * (this.maxWidth - this.minWidth + 1)) + this.minWidth;
                    const height = Math.floor(Math.random() * (this.maxHeight - this.minHeight + 1)) + this.minHeight;
        
                    if (this.placeBuilding(row, col, width, height)) {
                        attempts = 0; // Reset attempts on successful placement
                        break;
                    } else {
                        attempts++;
                        if (attempts > 1000) {
                            // Stop if too many failed attempts (indicates no more room)
                            break;
                        }
                    }
                }
            }
        }

    }

    // Print the grid for visualization
    printGrid(): void {
        console.log(this.grid.map(row => row.join(' ')).join('\n'));
    }
}
