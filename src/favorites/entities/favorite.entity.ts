import { User } from "src/users/entities/user.entity";
import { json } from "stream/consumers";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('favorites')
export class Favorite {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column("json", { nullable: true })
    contents: string;

    @OneToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    @Column()
    user_id: number;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;
}