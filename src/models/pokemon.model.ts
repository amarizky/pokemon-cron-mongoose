import { model, Schema, Document } from 'mongoose';
import { Pokemon } from '@interfaces/pokemon.interface';

// const pokemonSchema: Schema = new Schema({
//   id: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   types: {
//     type: Array<{type: string}>,
//     required: true,
//   },
//   abilities: {
//     type: Array<{name: string, effect: string}>,
//     required: true,
//   },
//   moves: {
//     type: Array<{moves: string}>,
//     required: true,
//   },
//   species: {
//     type: String,
//     required: true,
//   },
//   img: {
//     type: String,
//     required: true,
//   },
//   weight: {
//     type: Number,
//     required: true,
//   },
//   encounters: {
//     type: Array<{encounter: string}>,
//     required: true,
//   },
// });

const pokemonSchema: Schema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    types: {
        type: [String],
        required: true,
    },
    abilities: {
        type: [{ name: String, effect: String }],
        required: true,
    },
    moves: {
        type: [String],
        required: true,
    },
    species: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    encounters: {
        type: [String],
        required: true,
    },
    stats: {
        type: {
            hp: {
                type: Number,
            },
            attack: {
                type: Number,
            },
            defense: {
                type: Number,
            },
            special_attack: {
                type: Number,
            },
            special_defense: {
                type: Number,
            },
            speed: {
                type: Number,
            },
        },
        required: true,
    }
});

const pokemonModel = model<Pokemon & Document>('Pokemon', pokemonSchema, 'Pokemon');

export default pokemonModel;
