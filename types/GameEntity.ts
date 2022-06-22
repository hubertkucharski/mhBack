export interface NewGameEntity extends Omit<GameEntity, 'gameId'>{
    gameId?: string;
}
export interface GameEntity{
    gameId: string,
    gameBggID: number,
    gameName: string,
    image: string,
    thumbnail: string,
    yearPublished: number,
    averageRating: number,
    rank: number,
}
