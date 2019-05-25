import { Container, Sprite, utils } from 'pixi.js'

export default class World extends Container {
    static TEXTURES = ['img/Wall.png']
    constructor(app) {
        super()
        this.app = app

        this.rowCount = 12
        this.colCount = 20

        this.tileSize = 120

        this.grid = []

        this.initGrid()
    }

    getRow(y) {
        return Math.floor(y / this.tileSize)
    }

    getCol(x) {
        return Math.floor(x / this.tileSize)
    }

    initGrid() {
        this.grid = []
        for (let i = 0; i < this.colCount; i++) {
            this.generateColumn()
        }
    }

    generateColumn() {
        const col = []
        for (let i = 0; i < this.rowCount; i++) {
            if (i === 0 || i === this.rowCount - 1 || Math.random() < 0.1) {
                const wallSprite = new Sprite(utils.TextureCache['img/Wall.png'])
                const x = this.grid.length * this.tileSize
                const y = i * this.tileSize
                wallSprite.x = x
                wallSprite.y = y
                this.addChild(wallSprite)
                col.push(wallSprite)
            } else {
                col.push(null)
            }
        }
        this.grid.push(col)
    }

    getCell(row, col) {
        const c = this.grid[col]
        return c === undefined ? c : c[row]
    }
}
