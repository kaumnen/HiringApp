import express from 'express';
import bodyParser from 'body-parser';
import { sendNewDeveloper } from './database/mongodb/models/developer.js';
import { getDeveloperList, getHiredDeveloperList } from './database/mongodb/getDevelopers.js';
import { deleteDeveloper } from './database/mongodb/deleteDeveloper.js';
import { updateDeveloper } from './database/mongodb/updateDeveloper.js';
import { hireDeveloper } from './database/mongodb/hireDeveloper.js';
import { hireCheck } from './database/mongodb/hireCheck.js';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static('public'));

let calculateDates = () => {
    let today = new Date();
    let todayDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let tomorrow = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1);

    let todayReturn = todayDate.replace(/(^|\D)(\d)(?!\d)/g, '$10$2');
    let tomorrowReturn = tomorrow.replace(/(^|\D)(\d)(?!\d)/g, '$10$2');

    return { todayReturn, tomorrowReturn };
}

let checkDates = (startDate, endDate) => {
    let hireStartDate = new Date(startDate);
    let hireEndDate = new Date(endDate);

    return hireStartDate.getTime() >= hireEndDate.getTime()
}

app.get('/', (req, res) => {
    getDeveloperList().then(developers => {
        hireCheck(developers).then(() => {
            console.log("Hire check complete");
        }).catch(error => {
            console.log(error);
        });

        res.render('index', { developers: developers, startDate: calculateDates().todayReturn, endDate: calculateDates().tomorrowReturn });
    }).catch(console.error);
});

app.get('/hired', (req, res) => {
    getHiredDeveloperList().then(developers => {
        res.render('hiredDevelopers', { developers: developers });
    }).catch(console.error);
})

app.get('/add', (req, res) => {
    res.render('changeDeveloper', { developer: {}, verb: 'New', button: 'Submit', func: 'changeDeveloper' });
});

app.get('/hireTeam', (req, res) => {
    getDeveloperList().then(developers => {
        let dates = calculateDates();
        res.render('hireTeamDevs', {developers: developers, startDate: calculateDates().todayReturn, endDate: calculateDates().tomorrowReturn });
    }).catch(console.error);
});

app.post('/hireTeam', (req, res) => {
    if (checkDates(req.body.hireStartDate, req.body.hireEndDate)) {
        res.render('developerStatus', { devStatus: 'Hire start date cannot be on, or after end date!' });
    } else if (!req.body.developers || req.body.developers.length <= 1) {
        res.render('developerStatus', { devStatus: 'You have to hire 2 or more developers for a team hire!' });
    } else {
        console.log(req.body);
        req.body.developers.forEach(devID => {
            let teamHireStartDate = new Date(req.body.hireStartDate);
            let teamHireEndDate = new Date(req.body.hireEndDate);

            hireDeveloper(devID, 'team', teamHireStartDate, teamHireEndDate).then(() => {
                res.render('developerStatus', { devStatus: 'Developer team successfully hired' });
            }).catch(() => {
                res.render('developerStatus', { devStatus: 'Developer team not hired. Please try again' });
            });
        });
    }
})

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
        lastUpdated: lastUpdated,
        hired: false,
        startDate: new Date(),
        endDate: new Date(),
        typeOfHire: ""
    };

    sendNewDeveloper(developer).then(() => {
        res.render('developerStatus', { devStatus: 'New developer successfully added' });
    }).catch(() => {
        res.render('developerStatus', { devStatus: 'New developer not added. Please try again' });
    });
    
});

app.post('/editDev', (req, res) => {
    console.log(req.body);
    if (req.body.deleteButton) {
        deleteDeveloper(req.body.email).then(() => {
            res.render('developerStatus', { devStatus: 'Developer successfully deleted' });
        }).catch(() => {
            res.render('developerStatus', { devStatus: 'Developer not deleted. Please try again' });
        });
    } else if (req.body.changeButton) {
        res.render('changeDeveloper', { developer: req.body, verb: 'Edit', button: 'Update', func: 'updateDeveloper' });
    } else if (req.body.openHirePage) {
        res.render('hireDeveloper', {developer: req.body, startDate: req.body.startDate, endDate: req.body.endDate});
    }
    else if (req.body.hireDev) {
        
    }
});

app.post('/hireDev', (req, res) => {
    if (checkDates(req.body.hireStartDate, req.body.hireEndDate)) {
        res.render('developerStatus', { devStatus: 'Hire start date cannot be on, or after end date' });
    } else {
        hireDeveloper(req.body.id, 'single', req.body.hireStartDate, req.body.hireEndDate).then(() => {
            res.render('developerStatus', { devStatus: 'Developer successfully hired' });
        }).catch(() => {
            res.render('developerStatus', { devStatus: 'Developer not hired. Please try again' });
        });
    }
});

app.post('/updateDeveloper', (req, res) => {
    updateDeveloper(req.body.id, req.body).then(() => {
        res.render('developerStatus', { devStatus: 'Developer successfully updated' });
    }).catch(error => {
        res.render('developerStatus', { devStatus: 'Developer not updated. Please try again' });
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("server started on port " + PORT);
});