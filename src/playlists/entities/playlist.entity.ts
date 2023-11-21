import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/users/entities/user.entity";

@Entity('playlists')
export class Playlist {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column("json")
    contents_id: string;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    @Column()
    user_id: number;

    @Column()
    created_at: Date;
  
    @Column()
    updated_at: Date;
}
