import { NextFunction, Request, Response } from 'express';
import { Pokemon } from '@interfaces/pokemon.interface';
import PokemonService from '@/services/pokemon.service';
import { isEmpty } from '@utils/util';

class PokemonController {
    public pokemonService = new PokemonService();

    public getPokemon = async (req: Request, res: Response, next: NextFunction) => {
        var name = req.query.name as string;
        try {
            if (isEmpty(name)) {
                const getPokemons: Pokemon[] = await this.pokemonService.findAllPokemon();
                res.status(200).json({ message: 'findAllPokemon', data: getPokemons });
            } else {
                const getPokemonByName: Pokemon = await this.pokemonService.findPokemonByName(name);
                res.status(200).json({ message: 'findPokemonByName', data: getPokemonByName });
            }
        } catch (error) {
            next(error)
        }
    }
}

export default PokemonController;
