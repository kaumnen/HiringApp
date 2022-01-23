import mongoose from 'mongoose';
import { connect } from '../connect.js';

const developerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    location: String,
    image: String,
    pph: Number,
    currency: String,
    technology: String,
    description: String,
    yoe: Number,
    language: String,
    linkedin: String,
    lastUpdated: Date
});

const Developer = mongoose.model('Developer', developerSchema);


export function sendNewDeveloper({ name, email, phone, location, image, pph, currency, technology, description, yoe, language, linkedin, lastUpdated }) {
    let developer = {
        name: name,
        email: email,
        phone: phone,
        location: location,
        image: image,
        pph: pph,
        currency: currency,
        technology: technology,
        description: description,
        yoe: yoe,
        language: language,
        linkedin: linkedin,
        lastUpdated: lastUpdated
    };

    connect().then(() => {
        mongoose.model('Developer').create(developer);
        console.log("New developer added to database!");
    }).catch(error => {
        console.error(error);
    });
}