import express from 'express';
import bodyParser from 'body-parser';
import { sendNewDeveloper } from './database/mongodb/models/developer.js';
import { getDeveloperList } from './database/mongodb/getDevelopers.js';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    getDeveloperList().then(developers => {
        res.render('index', { developers: developers });
    }).catch(console.error);
});

app.get('/add', (req, res) => {
    res.render('addDeveloper');
})

app.post('/addDeveloper', (req, res) => {
    let datetime = new Date();
    let lastUpdated = datetime.toLocaleString();
    
    let developer = {
        name: req.body.developerName,
        email: req.body.developerEmail,
        phone: req.body.developerPhone,
        location: req.body.developerLocation,
        image: req.body.developerImageUrl,
        pph: req.body.developerPph,
        currency: req.body.currency,
        technology: req.body.developerTechLanguage,
        description: req.body.developerDescription,
        yoe: req.body.developerYoe,
        language: req.body.developerNativeLanguage,
        linkedin: req.body.developerLinkedIn,
        lastUpdated: lastUpdated
    };

    sendNewDeveloper(developer);
    res.redirect('/');
})

app.listen('3000', () => {
    console.log('Server is running on port 3000');
});