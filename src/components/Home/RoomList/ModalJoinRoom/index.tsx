import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Room } from 'types';

import styles from '../styles-modal.module.scss';

interface props {
    closeModal: Function,
    room: Room
}

export default function ModalJoinRoom({ closeModal, room }: props) {
    const [password, setPassword] = useState('');
    const [warning, setWarning] = useState('')
    
    const navigate = useNavigate();

    function handleJoinRoom() {
        if (!room) return

        if (room.password !== '') {
            if (password !== room.password) {
                setWarning('Неверный пароль');
                return;
            }
        }

        setWarning('')
        navigate(`/room/${room.name}/${room.password}`);
    };

    function closeJoinModal() {
        closeModal()
        setWarning('')
    }

    return (
        <>
            <div className={styles.modal__header}>
                <h3>Войти в комнату</h3>
                <button onClick={closeJoinModal}>Закрыть</button>
            </div>
            <input
                type="password" id="joinRoomPassword"
                className={styles.modal__form__field}
                placeholder='Пароль'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <div className={styles.modal__form__alert}>{warning}</div>
            <button className={styles.modal__form__submit} disabled={!password} onClick={handleJoinRoom}>Войти</button>
        </>
    );
}
