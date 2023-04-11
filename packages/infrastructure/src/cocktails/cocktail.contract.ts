import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm"
import { Ingredient } from "../schemas";

@Entity()
export class Cocktail {
    @PrimaryColumn() id: string;

    @Column() name: string;

    @Column({ nullable: true, type: "float" }) note?: number;

    @Column({ nullable: true }) pictureKey?: string;

    @ManyToMany(() => Ingredient)
    @JoinTable()
    ingredients?: Ingredient[]

    constructor(
        id: string,
        name: string,
        note?: number,
        pictureKey?: string,
        ingredients?: Ingredient[]
    ) {
        this.id = id;
        this.name = name;
        this.note = note;
        this.pictureKey = pictureKey;
        this.ingredients = ingredients;
    }
}
