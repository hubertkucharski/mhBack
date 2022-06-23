export interface NewGameEntity extends Omit<GameEntity, 'gameId'>{
    gameId?: string;
}
export interface SimpleGameEntity {
    gameId: string,
    gameName: string
}
export interface GameEntity{
    gameId: string,
    gameBggId: number,
    gameName: string,
    image: string,
    thumbnail: string,
    yearPublished: number,
    averageRating: number,
    rank: number,
}
