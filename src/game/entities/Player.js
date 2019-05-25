import { Container, Sprite, utils, Point, AnimatedSprite } from 'pixi.js'

const SPEED = 5
const BOOST_SPEED = 20
const ACCEL = 0.1
const THRUSTER_CYCLE = 8
const BULLET_SPEED = 20

const RATE_OF_FIRE = 10

const BOOST_COOLDOWN = 180
const BOOST_LENGTH = 30

export default class Player extends Container {
    static TEXTURES = [
        'img/Shuttle.png',
        'img/Turret.png',
        'img/Shuttle-Thruster-1.png',
        'img/Shuttle-Thruster-2.png',
        'img/Shuttle-Thruster-3.png',
    ]

    constructor(game) {
        super()
        this.game = game

        this.hitSize = 128

        this.vx = 0
        this.vy = 0

        this.accelX = 0
        this.accelY = 0

        this.thrusterCounter = 0
        this.currentSpeed = SPEED

        this.fireCounter = 0

        this.boostCounter = 0
        this.boosts = 1
        this.boosting = false

        this.spriteContainer = new Container()
        this.addChild(this.spriteContainer)

        const texture = utils.TextureCache['img/Shuttle.png']
        const sprite = new Sprite(texture)
        this.sprite = sprite
        sprite.pivot = new Point(sprite.width / 2, sprite.height / 2)

        const cannonTexture = utils.TextureCache['img/Turret.png']
        this.cannon = new Sprite(cannonTexture)

        this.cannon.pivot = new Point(this.cannon.width - 56, this.cannon.height / 2)
        this.cannon.x = this.cannon.width - 46

        this.spriteContainer.addChild(this.cannon)

        this.thruster = new AnimatedSprite([
            utils.TextureCache['img/Shuttle-Thruster-1.png'],
            utils.TextureCache['img/Shuttle-Thruster-2.png'],
            utils.TextureCache['img/Shuttle-Thruster-3.png'],
        ])

        this.thruster.pivot = new Point(this.thruster.width, this.thruster.height / 2)
        this.thruster.x = -this.sprite.width / 2
        this.spriteContainer.addChild(this.thruster)

        this.spriteContainer.addChild(sprite)

        this.keys = {
            down: game.registerKey(83),
            left: game.registerKey(65),
            up: game.registerKey(87),
            right: game.registerKey(68),
            shift: game.registerKey(16),
        }

        this.keys.down.press = () => {
            this.accelY += ACCEL
        }
        this.keys.down.release = () => {
            this.accelY -= ACCEL
        }

        this.keys.up.press = () => {
            this.accelY -= ACCEL
        }
        this.keys.up.release = () => {
            this.accelY += ACCEL
        }

        this.keys.right.press = () => {
            this.accelX += ACCEL
        }
        this.keys.right.release = () => {
            this.accelX -= ACCEL
        }

        this.keys.left.press = () => {
            this.accelX -= ACCEL
        }
        this.keys.left.release = () => {
            this.accelX += ACCEL
        }

        this.mouse = {
            isDown: false,
        }

        window.addEventListener('mousedown', () => (this.mouse.isDown = true))
        window.addEventListener('mouseup', () => (this.mouse.isDown = false))
    }

    shoot = () => {
        const firePt = this.cannon.toGlobal(new Point(this.cannon.pivot.x + 50, this.cannon.pivot.y))
        this.game.bulletLayer.spawnBullet(
            firePt.x,
            firePt.y,
            this.spriteContainer.rotation + this.cannon.rotation,
            BULLET_SPEED,
        )
    }

    update() {
        // Animate thruster
        this.thruster.visible = this.accelX || this.accelY || this.boosting
        this.thrusterCounter = (this.thrusterCounter + 1) % THRUSTER_CYCLE
        if (this.thrusterCounter === 0) {
            this.thruster.gotoAndStop(Math.floor(Math.random() * this.thruster.totalFrames))
        }

        // Fire while mouse held down
        if (this.fireCounter === 0) {
            if (this.mouse.isDown) {
                this.shoot()
                this.fireCounter++
            }
        } else {
            this.fireCounter = (this.fireCounter + 1) % RATE_OF_FIRE
        }

        // Boost using shift
        if (this.boostCounter === 0) {
            if (this.boosting) {
                this.boosting = false
                this.thruster.scale = new Point(1, 1)
            }
            if (this.keys.shift.isDown) {
                this.boosting = true
                this.thruster.scale = new Point(2, 1)
                this.boostCounter++
                this.boosting = true
            } else if (this.boosts === 0) {
                this.boosts = 1
            }
        } else {
            this.boostCounter = (this.boostCounter + 1) % (this.boosting ? BOOST_LENGTH : BOOST_COOLDOWN)
        }

        // Angle cannon properly
        const mousePos = this.spriteContainer.toLocal(this.game.app.renderer.plugins.interaction.mouse.global)
        const angleToMouse = Math.atan2(mousePos.y - this.cannon.y, mousePos.x - this.cannon.x)
        this.cannon.rotation = angleToMouse

        // Move ship
        this.vx *= 0.95
        this.vy *= 0.95
        this.vx += Math.max(-1, Math.min(1, this.accelX))
        this.vy += Math.max(-1, Math.min(1, this.accelY))
        const theta = Math.atan2(this.vy, this.vx)
        const dist = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
        this.vx = dist * Math.cos(theta)
        this.vy = dist * Math.sin(theta)
        const speed = this.boosting ? BOOST_SPEED : SPEED
        if (dist) {
            const dx = speed * this.vx
            const dy = speed * this.vy
            this.y += dy
            this.x += dx
        }
        this.spriteContainer.rotation = theta
        this.resolveWallCollision()
    }

    resolveWallCollision() {
        let hitThing = false
        do {
            const x = this.x
            const y = this.y
            hitThing = false
            let cell = this.game.world.getCell(this.game.world.getRow(y), this.game.world.getCol(x - this.hitSize / 2))
            if (cell) {
                this.x += 1
                hitThing = true
            }

            cell = this.game.world.getCell(this.game.world.getRow(y), this.game.world.getCol(x + this.hitSize / 2))
            if (cell) {
                this.x -= 1
                hitThing = true
            }

            cell = this.game.world.getCell(this.game.world.getRow(y - this.hitSize / 2), this.game.world.getCol(x))
            if (cell) {
                this.y += 1
                hitThing = true
            }

            cell = this.game.world.getCell(this.game.world.getRow(y + this.hitSize / 2), this.game.world.getCol(x))
            if (cell) {
                this.y -= 1
                hitThing = true
            }
        } while (hitThing)
    }

    destroy() {
        Object.values(this.keys).forEach((k) => k.unsubscribe())
    }
}
