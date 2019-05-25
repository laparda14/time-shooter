import React from 'react'
import PropTypes from 'prop-types'
import Game from 'game/index'

export class GameContainer extends React.Component {
    static propTypes = {
        className: PropTypes.string.isRequired,
    }

    static defaultProps = {
        className: 'game-container',
    }

    gameAreaRef = null
    componentDidUpdate() {
        if (this.game) {
            this.game.resize()
        }
    }

    handleRef = (e) => {
        this.gameAreaRef = e
        if (e) {
            this.game = new Game(e)
        }
    }

    render() {
        const { className } = this.props
        return <div className={className} ref={this.handleRef} />
    }
}

export default GameContainer
