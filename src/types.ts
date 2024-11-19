export interface UserRoom {
  name: string,
  id: number,
  waiting?: boolean
  diceCount?: number
}

export interface UserGame extends UserRoom {
  dices: [],
  diceCount: number
}

export interface Room {
    players: {
      [key: string]: UserRoom
    },
    name: string;
    password: string,
    number: number,

    game: Game | null
}

export interface RoomGame {
  players: {
    [key: string]: UserRoom
  },
  name: string;
  password: string,
  number: number,

  game: Game
}

export interface Game {
  currentPlayer: number,
  currentBid: {
    value: number,
    count: number
  },
  
  players: UserGame[]
}

export const initialRoom: Room = {
  players: {},
  name: '',
  password: '',
  number: 2,

  game: null
}