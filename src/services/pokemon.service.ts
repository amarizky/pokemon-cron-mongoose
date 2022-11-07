import { HttpException } from '@exceptions/HttpException';
import pokemonModel from '@/models/pokemon.model';
import { Pokemon } from '@/interfaces/pokemon.interface';
import axios from 'axios';
import { titleCase } from 'title-case';

class PokemonService {
    public pokemon = pokemonModel;

    public async findAllPokemon(): Promise<Pokemon[]> {
        const findPokemon: Pokemon[] = await this.pokemon.find();
        return findPokemon;
    }

    public async findPokemonByName(pokemonName: string): Promise<Pokemon> {
        const findPokemon: Pokemon = await this.pokemon.findOne({
            name: {
                $regex: pokemonName,
                $options: 'i',
            },
        });
        if (!findPokemon) throw new HttpException(409, "Pokemon doesn't exist");

        return findPokemon;
    }

    public async addOnePokemon(): Promise<String> {
        var c = await this.pokemon.countDocuments();
        var getPokeApi = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=50");
        var data = getPokeApi.data.results;
        var dataKeys = Object.keys(data);

        // if result.length == data count in database
        if (dataKeys.length == c) return '';

        var nthData = data[dataKeys[c]];
        var data = (await axios(nthData.url)).data;
        var encounters = await axios.get(data.location_area_encounters);
        var abilities = [];

        for (var ab of data.abilities) {
            var ab_fetch = await axios.get(ab.ability.url);
            var ability = {
                'name': titleCase(ab_fetch.data.name),
                'effect': ab_fetch.data.effect_entries.filter((e) => {
                    return e.language.name == 'en';
                })[0].effect,
            };
            abilities.push(ability);
        }

        // Inserting Pokemon data
        await new pokemonModel({
            // Required data
            'id': titleCase(data.name),
            'name': titleCase(data.name),
            'types': data.types.map((t) => titleCase(t.type.name)),
            'abilities': abilities,
            'moves': data.moves.map((m) => titleCase(m.move.name)),
            'species': titleCase(data.species.name),
            // Additional data
            'img': data.sprites.front_default,
            'weight': data.weight,
            'encounters': encounters.data.map((e) => titleCase(e.location_area.name)),
            'stats': {
                'hp': data.stats[0].base_stat,
                'attack': data.stats[1].base_stat,
                'defense': data.stats[2].base_stat,
                'special_attack': data.stats[3].base_stat,
                'special_defense': data.stats[4].base_stat,
                'speed': data.stats[5].base_stat,
            },
        }).save();

        return titleCase(data.name);
    }
}

export default PokemonService;
