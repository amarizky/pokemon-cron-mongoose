export interface Pokemon {
    _id: string;
    id: String;
    name: String;
    types: [String];
    abilities: [{ name: String, effect: String }];
    moves: [String];
    species: String;
    img: String;
    weight: Number;
    encounters: [String];
    stats: {
        hp: Number;
        attack: Number;
        defense: Number;
        special_attack: Number;
        special_defense: Number;
        speed: Number;
    },
}

