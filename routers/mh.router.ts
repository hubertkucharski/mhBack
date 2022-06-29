import {Router} from "express";
import {GameRecord} from "../records/game.record";
import {GameCollectionRecord} from "../records/game.collection.record";

export const MHRouter = Router()
    .get('/', async (req,  res) =>{
        res.send('Hello');
    })

    .get('/search/:gameName?', async (req, res) => {
        const game = await GameRecord.findAll(req.params.gameName ?? '');

        res.json(game);
    })

    .get('/my-collection/:userId', async (req, res) => {

        const games = await GameCollectionRecord.findUserGames( req.params.userId);

        // games.map(async (el)=>(

           // collection.push(await GameRecord.getOne(el.gameId)))
        // )
        // const {gameId, userId} = games;
        // console.log(gameId)
        // for (const game of games) {
        //     collection.push(await GameRecord.getOne(games.gameId))
        // }
        // console.log( collection)
        res.json(games);
    })
    .get('/my-collection/', async (req, res) => {
        const game = await GameCollectionRecord.findAllUsers( '');

        res.json(game);
    })
    .get('/:id', async (req, res) =>{

        const game = await GameRecord.getOne(req.params.id);

        res.json(game);
    })

    .post('/', async (req, res) => {

        const game = new GameCollectionRecord(req.body);

        await game.insertToCollection();

        res.json(game);
    })
    .delete('/', async (req, res) =>{

        const game = new GameCollectionRecord(req.body)

        await game.deleteFromCollection();

        res.json(game);
    })
