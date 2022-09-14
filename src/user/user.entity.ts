import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column({unique: true, nullable: false,})
    userBggId: string;

    @Column({unique: true})
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    password: string;

    @Column()
    isActive: boolean;

    @Column({
        nullable: true,
        length: 255,
        default: null,
    })
    token: string;
}
