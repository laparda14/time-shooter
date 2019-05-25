import { Container } from 'pixi.js'

export default class Enemy extends Container {
    constructor() {
        super()
        this.speed = 0
    }
    update() {
        this.x += this.speed
    }
}
