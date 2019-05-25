import { Container, Sprite, Point, utils } from 'pixi.js'

export default class BulletLayer extends Container {
    static TEXTURES = ['img/Bullet-1.png']

    spawnBullet(x, y, theta, speed) {
        const bullet = new Sprite(utils.TextureCache['img/Bullet-1.png'])
        bullet.pivot = new Point(bullet.width / 2, bullet.height / 2)
        bullet.x = x
        bullet.y = y
        bullet.rotation = theta
        bullet.fire_speed = speed
        this.addChild(bullet)
    }

    update() {
        this.children.forEach((bullet) => {
            bullet.x += Math.cos(bullet.rotation) * bullet.fire_speed // eslint-disable-line
            bullet.y += Math.sin(bullet.rotation) * bullet.fire_speed // eslint-disable-line

            if (bullet.x > window.innerWidth || bullet.x < 0 || bullet.y > window.innerHeight || bullet.y < 0) {
                bullet.destroy()
            }
        })
    }
}
