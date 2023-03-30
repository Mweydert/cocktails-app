import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class Cocktail {
    @PrimaryColumn() id: string;

    @Column() name: string;

    @Column({ nullable: true, type: "float" }) note?: number;

    @Column({ nullable: true }) pictureKey?: string;

    constructor(
        id: string,
        name: string,
        note?: number,
        pictureKey?: string,
    ) {
        this.id = id;
        this.name = name;
        this.note = note;
        this.pictureKey = pictureKey;
    }
}
