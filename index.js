import express from 'express';
import cors from "cors";

import { dodajScore, dodajTest, dodajUsera, odgovoriNetacno, odgovoriTacno, prijaviSe, vratiAktivneUsere, vratiLeaderboard, 
    vratiStatistikuTesta, vratiSveTestove, vratiTest, vratiUsere } from './controller.js';

const PORT = 5000;

const app = express();
app.use(express.json())
app.use(cors());

app.get('/', (req, res) => {
    res.send('It works!')
})

app.post('/dodajusera', dodajUsera)
app.post('/dodajscore', dodajScore)
app.post('/dodajtest', dodajTest)
app.put('/prijavise', prijaviSe)
app.put('/odgtacno', odgovoriTacno)
app.put('/odgnetacno', odgovoriNetacno)
app.get('/vratiusere', vratiUsere)
app.get('/leaderboard', vratiLeaderboard)
app.get('/vratitest/:testname', vratiTest)
app.get('/vratisvetestove', vratiSveTestove)
app.get('/vratistat/:testname', vratiStatistikuTesta)
app.get('/vratiaktivne', vratiAktivneUsere)

app.listen(PORT, () => {
    console.log(`backend server is running on port ${PORT}`);
})