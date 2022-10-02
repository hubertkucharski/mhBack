import {BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../user/user.entity";

@Entity()
export class MhGames extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    gameId: string;

    @Column({
        nullable: false,
        type: "mediumint",
    })
    gameBggId: number;

    @Column({
        nullable: false,
        length: 100,
    })
    gameName: string;

    @Column({
        nullable: true,
        length: 160,
    })
    image: string;

    @Column({
        nullable: true,
        length: 160,
    })
    thumbnail: string;

    @Column({
        nullable: true,
        type: 'smallint',
    })
    yearPublished: number;

    @Column({
        nullable: true,
        type: 'decimal',
        precision: 6,
        scale: 5,
    })
    averageRating: number;

    @Column({
        nullable: true,
        type: 'smallint',
    })
    rank: number;

    @ManyToMany(type => User, entity => entity.userId)
    userId: User[]

}
