import {BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {MhGames} from "../bgg-games/bggGames.entity";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column({unique: true, nullable: true,})
    userBggId: string;

    @Column({unique: true})
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({
        nullable: true,
        length: 60,
        default: null,
    })
    password: string;

    @Column()
    isActive: boolean;

    @Column({
        nullable: true,
        length: 255,
        default: null,
    })
    token: string;

    @Column({
        nullable: true,
        length: 255,
        default: null,
    })
    accessToken: string;

    @ManyToMany(type => MhGames, entity => entity.gameId, {
        cascade: true,
    })
    @JoinTable()
    gameId: MhGames[];
}
