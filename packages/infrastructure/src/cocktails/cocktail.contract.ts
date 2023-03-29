import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class Cocktail {
    @PrimaryColumn() id: string;

    @Column() name: string;

    @Column({ nullable: true }) note?: number;

    @Column({ nullable: true }) pictureUrl?: string;

    constructor(
        id: string,
        name: string,
        note?: number,
        pictureUrl?: string,
    ) {
        this.id = id;
        this.name = name;
        this.note = note;
        this.pictureUrl = pictureUrl;
    }
}
