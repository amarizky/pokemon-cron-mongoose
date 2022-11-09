import { HttpException } from '@exceptions/HttpException';
import pokemonModel from '@/models/pokemon.model';
import { Pokemon } from '@/interfaces/pokemon.interface';
import axios from 'axios';
import { titleCase } from 'title-case';
import { logger } from '@/utils/logger';

class PokemonService {
    public pokemon = pokemonModel;
    public c = 0;

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

    public async getExistingPokemon(): Promise<number> {
        return (await this.pokemon.countDocuments()) + 1;
    }

    public async addOnePokemon(): Promise<void> {
        if (this.c == 0) this.c = await this.getExistingPokemon();
        let data = null;
        try {
            data = (await axios.get("https://pokeapi.co/api/v2/pokemon/" + this.c)).data;
        } catch (error) {
            logger.info('All data has been received');
            return;
        }

        let encounters = (await axios.get(data.location_area_encounters)).data;
        let abilities = [];

        for (let ab of data.abilities) {
            let ab_fetch = await axios.get(ab.ability.url);
            let ability = {
                'name': titleCase(ab_fetch.data.name),
                'effect': ab_fetch.data.effect_entries.filter((e) => {
                    return e.language.name == 'en';
                })[0].effect,
            };
            abilities.push(ability);
        }

        // Inserting Pokemon data
        let pokemonData = new pokemonModel({
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
            'encounters': encounters.map((e) => titleCase(e.location_area.name)),
            'stats': {
                'hp': data.stats[0].base_stat,
                'attack': data.stats[1].base_stat,
                'defense': data.stats[2].base_stat,
                'special_attack': data.stats[3].base_stat,
                'special_defense': data.stats[4].base_stat,
                'speed': data.stats[5].base_stat,
            },
        });

        try {
            await pokemonData.save();
        } catch (error) {
            logger.warn('Error! Retrying on the next cycle')
        }

        logger.info('Added pokemon: ' + titleCase(data.name));

        this.c++;
        return;
    }
}

export default PokemonService;
