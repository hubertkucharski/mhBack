export interface NewGameEntity extends Omit<GameEntity, 'gameId'>{
    gameId?: string;
}
export interface CollectionEntity{
    collectionId?: string
    userId: string,
    gameId: string
}
export interface SimpleUsersEntity{
    userId: string
}
export interface CollectionGamesEntity extends CollectionEntity {
    collectionId: string
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
