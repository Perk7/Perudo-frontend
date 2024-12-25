import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import webSocket from 'socket';

import styles from '../styles-modal.module.scss';

interface props {
    closeModal: Function,
    roomsNames: string[]
}

const maximumPlayers = 8

export default function ModalCreateRoom({ closeModal, roomsNames }: props) {
    const [roomName, setRoomName] = useState('');
    const [number, setNumber] = useState('2');
    const [password, setPassword] = useState('');
    const [probabilities, setProbabilities] = useState(false);

    const [warning, setWarning] = useState('')

    const navigate = useNavigate();

    function handleCreateRoom() {
        if (roomsNames.includes(roomName)) {
            setWarning('Игра с таким названием уже есть')
            return
        }

        if (roomName.length < 4 || password.length < 4) {
            setWarning('Название и пароль должны быть не короче 4ех символов')
            return
        }

        setWarning('')
        const id = localStorage.getItem('playerId')
        const name = localStorage.getItem('playerName')

        webSocket.emit('createRoom', {
            name: roomName,
            password,
            number: +number,
            player: { name, id },
            probs: probabilities
        });

        navigate(`/room/${roomName}/${password}`);
    };

    function closeCreateModal() {
        closeModal()
        setWarning('')
    }

    function handleNumberChange(value: string) {
        if (!value.length) return setNumber(value)
        if (+value < 2)
            return setNumber('2')
        if (+value > maximumPlayers)
            return setNumber(maximumPlayers.toString())
        return setNumber(value.toString())
    }

    return (
        <>
            <div className={styles.modal__header}>
                <h3>Создание комнаты</h3>
                <button onClick={closeCreateModal}>Закрыть</button>
            </div>

            <input
                type="text" id="roomName"
                className={styles.modal__form__field}
                maxLength={10}
                placeholder='Название'
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
            />
            <input
                type="password" id="roomPassword"
                className={styles.modal__form__field}
                maxLength={10}
                placeholder='Пароль'
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <div className={styles.modal__form__numBlock}>
                <label className={styles.modal__form__numLabel}>Отображение вероятностей: </label>
                <input
                    type="checkbox" id="roomProbs"
                    className={styles.modal__form__checkbox}
                    checked={probabilities}
                    onChange={e => setProbabilities(e.target.checked)}
                />
            </div>
            <div className={styles.modal__form__numBlock}>
                <label className={styles.modal__form__numLabel}>Количество игроков: </label>
                <input
                    type="number" id="roomNumber"
                    className={styles.modal__form__field + " " + styles.modal__form__field_number}
                    min={2}
                    max={maximumPlayers}
                    value={number}
                    onChange={e => handleNumberChange(e.target.value)}
                />
            </div>

            <div className={styles.modal__form__alert}>{warning}</div>
            <button className={styles.modal__form__submit} disabled={!(roomName && password)} onClick={handleCreateRoom}>Создать</button>
        </>
    );
}
