import {Router} from "express";
import {GameRecord} from "../records/game.record";
import fetch from 'node-fetch';

export const BGGRouter = Router()
    .get('/', async (req,  res) =>{
        res.send('Hello bgg')
    })

    .get('/search', async (req, res) => {
        // const game = await GameRecord.findAll(req.params.name ?? '');
        // console.log('dziala')
        // const game = await fetch('https://bgg-json.azurewebsites.net/thing/31260')
        // const json = await game.json()

        // const {gameId} = json;
        // const newGame = new GameRecord({gameBggID: 341,gameName: 'dara', gameImage: 'urlimaga', gameThumbnail: 'url2', yearPublished: 2000, averageRating: 8.3333, rank: 5.666})
        // await newGame.insert();
        // res.json(json)
        res.send('ok')
    })
    // .get('/:id', async (req, res) =>{
    //     const game = await GameRecord.getOne(req.params.id)
    //     console.log(game)
    //     res.json(game)
    // })
    // .post('/', async (req, res) => {
    //     const game = new GameRecord(req.body);
    //     await game.insert()
    //     res.json(game)
    // })
