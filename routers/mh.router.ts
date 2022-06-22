import {Router} from "express";
import {GameRecord} from "../records/game.record";

export const MHRouter = Router()
    .get('/', async (req,  res) =>{
        res.send('Hello')
    })

    // .get('/search/:name?', async (req, res) => {
    //     const game = await GameRecord.findAll(req.params.gameName ?? '');
    //
    //     res.json(game)
    // })
    .get('/:id', async (req, res) =>{
        const game = await GameRecord.getOne(req.params.id)
        console.log(game)
        res.json(game)
    })
    // .post('/', async (req, res) => {
    //     const game = new GameRecord(req.body);
    //     await game.insert()
    //     res.json(game)
    // })
