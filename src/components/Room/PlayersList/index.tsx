import { Room as RoomType, UserGame, UserRoom } from 'types';

import styles from './styles.module.scss';
import { PulseLoader } from 'react-spinners';

interface props {
    gameState:  RoomType
}

const dicesNumberEnding = ['кость', 'кости', 'кости', 'кости', 'костей']

export default function PlayersList({ gameState }: props) {
    
    function checkPlayerIsActive(player: UserGame|UserRoom) {
        return (gameState.game?.players[gameState.game.currentPlayer]?.id === player?.id)
    }

    function getPlayerList() {
        if (gameState.game) {
            return gameState.game.players
        }
        return Object.values(gameState.players)
    }

    return (
        <ul className={styles.playerList}>
        {getPlayerList().map(player => 
            <li key={player.id} className={checkPlayerIsActive(player) ? styles.activePlayer : ''}>
                {checkPlayerIsActive(player)
                    ? <strong>{player.name}</strong>
                    : <span>{player.name}</span>
                }
                {gameState.players[player.id].waiting 
                    ? <PulseLoader color='#DDD' size={10} speedMultiplier={0.5} />
                    : (gameState.game && <div className={styles.playerCount}>{player?.diceCount} {dicesNumberEnding[(player?.diceCount || 1)-1]}</div>)
                }
            </li>
        )}
        {[...Array(gameState.number - getPlayerList().length)].map((_, index) => (
            <li key={index} className={styles.emptyItem}>
                <span>Пусто</span>
            </li>
        ))}
        </ul>
    );
}
