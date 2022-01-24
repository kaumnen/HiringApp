import express from 'express';
import bodyParser from 'body-parser';
import { sendNewDeveloper } from './database/mongodb/models/developer.js';
import { getDeveloperList } from './database/mongodb/getDevelopers.js';
import { deleteDeveloper } from './database/mongodb/deleteDeveloper.js';
import { updateDeveloper } from './database/mongodb/updateDeveloper.js';

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
    res.render('changeDeveloper', { developer: {}, verb: 'New', button: 'Submit', func: 'changeDeveloper' });
});

app.post('/changeDeveloper', (req, res) => {
    let datetime = new Date();
    let lastUpdated = datetime.toLocaleString();
    
    let developer = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        location: req.body.location,
        image: req.body.image,
        pph: req.body.pph,
        currency: req.body.currency,
        technology: req.body.technology,
        description: req.body.description,
        yoe: req.body.yoe,
        language: req.body.language,
        linkedin: req.body.linkedin,
        lastUpdated: lastUpdated
    };

    sendNewDeveloper(developer).then(() => {
        res.render('developerStatus', { devStatus: 'successfully added' });
    }).catch(() => {
        res.render('developerStatus', { devStatus: 'not added. Please try again' });
    });
    
});

app.post('/editDev', (req, res) => {
    if (req.body.deleteButton) {
        deleteDeveloper(req.body.email).then(() => {
            res.render('developerStatus', { devStatus: 'successfully deleted' });
        }).catch(() => {
            res.render('developerStatus', { devStatus: 'not deleted. Please try again' });
        });
    } else {
        res.render('changeDeveloper', { developer: req.body, verb: 'Edit', button: 'Update', func: 'updateDeveloper' });
    }
});

app.post('/updateDeveloper', (req, res) => {
    updateDeveloper(req.body.id, req.body).then(() => {
        res.render('developerStatus', { devStatus: 'successfully updated' });
    }).catch(error => {
        res.render('developerStatus', { devStatus: 'not updated. Please try again' });
    });
});

app.listen('3000', () => {
    console.log('Server is running on port 3000');
});