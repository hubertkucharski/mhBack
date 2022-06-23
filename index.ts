// import fetch from "cross-fetch";
import express, {json, Router} from 'express';
import cors from 'cors';
import 'express-async-errors';
// import {handleError} from "./utils/errors";
import rateLimit from "express-rate-limit";
import {MHRouter} from "./routers/mh.router";
import {config} from './config/config';
// import {GameRecord} from "./records/game.record";

const app = express();

app.use(cors({
    origin: config.corsOrigin,
}));
app.use(json());
app.use(rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
}));

// app.use((req, res, next) => {
//     console.log('time: ', new Date().toLocaleTimeString() )
//     res.send('test1')
//     next()
// });
//kod do zapisu do bazy danych. obecnie pobrano 21999
// (async () => {
//     for(let i=20000; i<22000; i++){
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
//         if(isExpansion === false){
//             console.log(gameBggID)
//             const newGame = new GameRecord({gameBggId, gameName, image, thumbnail, yearPublished, averageRating, rank})
//             await newGame.insert();
//         }else console.log(`Brak nr ${i} ${typeof isExpansion}`)
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

// app.use(handleError);

app.listen(3001, '0.0.0.0', ()=>{
    console.log('Running server on http://localhost:3001')
});
