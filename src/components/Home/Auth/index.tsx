import { useState } from 'react';

import styles from './styles.module.scss'

interface props {
    authStatusHandler: Function
}

export default function Auth({ authStatusHandler }: props) {
    const [nickname, setNickname] = useState('');
    const [warning, setWarning] = useState('')
    
    function auth() {
        if (nickname.length < 4)
            return setWarning('Длина имени должна быть не меньше 4ех символов')
        else 
            setWarning('')

        const timestamp = Date.now();

        localStorage.setItem('playerId', timestamp.toString());
        localStorage.setItem('playerName', nickname);

        authStatusHandler(true)
    };

    return (
        <article className={styles.authBlock}>
            <h2 className={styles.authHeading}>Авторизация</h2>
            <div className={styles.authForm}>
                <input
                    type="text" placeholder="Ваше имя" maxLength={10}
                    value={nickname} onChange={e => setNickname(e.target.value)}
                />
                <button disabled={!nickname} onClick={auth}>Войти</button>
            </div>
            <div className={styles.authAlert}>{warning}</div>
        </article>
    );
}