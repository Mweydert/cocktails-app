import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class Cocktail {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    note?: number;

    constructor(
        id: string,
        name: string,
        note?: number,
    ) {
        this.id = id;
        this.name = name;
        this.note = note;
    }
}
