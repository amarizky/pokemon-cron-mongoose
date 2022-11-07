import { Router } from 'express';
import PokemonController from '@controllers/pokemon.controller';
import { Routes } from '@interfaces/routes.interface';

class PokemonRoute implements Routes {
    public path = '/';
    public router = Router();
    public pokemonController = new PokemonController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}pokemon`, this.pokemonController.getPokemon);
    }
}

export default PokemonRoute;
