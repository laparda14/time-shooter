export default class World {
    constructor(app) {
        this.app = app

        this.player = {
            x: 0,
            y: 0,
            angle: 0,
        }

        this.enemies = []

        this.projectiles = []
    }
}
