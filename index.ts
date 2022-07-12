import fetch from "cross-fetch";
import express, {json, Router} from 'express';
import cors from 'cors';
import 'express-async-errors';
// import {handleError} from "./utils/errors";
import rateLimit from "express-rate-limit";
import {MHRouter} from "./routers/mh.router";
import {GameRecord} from "./records/game.record";
// import {pool} from "./utils/db";
// import {config} from 'dotenv'; <- it is ready to heroku
import { config } from './config/config'

const app = express();
const port: any = process.env.PORT || 3001;

app.use(cors({
    origin: config.corsOrigin,
}));
app.use(json());
app.use(rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
}));

//kod do zapisu do bazy danych. obecnie pobrano 75715
//dodać /521/
// (async () => {
//     for(let i=83000; i<85000; i++){
//         const game = await fetch(`https://bgg-json.azurewebsites.net/thing/${i}`)
//         const json = await game.json()
//
//         const {
//             gameId: gameBggId,
//             name: gameName,
//             image,
//             thumbnail,
//             yearPublished,
//             averageRating,
//             rank,
//             isExpansion
//         } = json;
//         if(isExpansion === false && rank > 0){
//             console.log(gameBggId)
//             const newGame = new GameRecord({gameBggId, gameName, image, thumbnail, yearPublished, averageRating, rank})
//             await newGame.insert();
//         }else console.log(`Brak nr ${i} ${typeof isExpansion} ${isExpansion} ${rank}`)
//         // console.log(json.name)
//
//     }
//
// })();

const router = Router();

router.use('/mh', MHRouter);
// router.use('/mh', BGGRouter)
app.use('/api', router);
//base path /api/mh/

// app.use(async (req, res, next) => {
//     const [result] = await pool.execute('select * from `db_05`')
//     res.send(result)
//
//     next()
// });

// app.use(handleError);

app.listen(port, '0.0.0.0', ()=>{
    console.log(`Running server on port: ${port}`)
});
