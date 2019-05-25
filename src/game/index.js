import { Application, Loader } from 'pixi.js'
import Player from 'game/entities/Player'
import World from 'game/World'
import BulletLayer from 'game/BulletLayer'

function keyboard(value) {
    let key = {}
    key.value = value
    key.isDown = false
    key.isUp = true
    key.press = undefined
    key.release = undefined
    // The `downHandler`
    key.downHandler = (event) => {
        if (event.keyCode === key.value) {
            if (key.isUp && key.press) {
                key.press()
            }
            key.isDown = true
            key.isUp = false
            event.preventDefault()
        }
    }

    // The `upHandler`
    key.upHandler = (event) => {
        if (event.keyCode === key.value) {
            if (key.isDown && key.release) {
                key.release()
            }
            key.isDown = false
            key.isUp = true
            event.preventDefault()
        }
    }

    // Attach event listeners
    const downListener = key.downHandler.bind(key)
    const upListener = key.upHandler.bind(key)

    window.addEventListener('keydown', downListener, false)
    window.addEventListener('keyup', upListener, false)

    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener('keydown', downListener)
        window.removeEventListener('keyup', upListener)
    }

    return key
}

export default class Game {
    constructor(rootContainerRef) {
        this.rootContainer = rootContainerRef
        this.loadTextures(() => this.init())

        const app = new Application({
            antialias: false,
        })
        this.app = app

        app.renderer.backgroundColor = 0x061639
        app.renderer.view.style.position = 'absolute'
        app.renderer.view.style.display = 'block'
        app.renderer.autoResize = true
        app.renderer.resize(window.innerWidth, window.innerHeight)

        this.rootContainer.appendChild(app.view)
    }

    registerKey(keyCode) {
        return keyboard(keyCode)
    }

    loadTextures(callback) {
        const textures = [...Player.TEXTURES, ...BulletLayer.TEXTURES, ...World.TEXTURES]
        Loader.shared.add(textures).load(callback)
    }

    init() {
        this.world = new World(this)
        this.app.stage.addChild(this.world)
        this.bulletLayer = new BulletLayer()
        this.app.stage.addChild(this.bulletLayer)

        this.player = new Player(this)
        this.player.x = 200
        this.player.y = 200
        this.app.stage.addChild(this.player)

        // Begin game loop
        this.app.ticker.add((delta) => this.update(delta))
    }

    update() {
        this.bulletLayer.update()
        this.player.update()
    }

    destroy() {}
}
