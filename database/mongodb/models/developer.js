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
    lastUpdated: Date,
    hired: Boolean,
    startDate: Date,
    endDate: Date,
    typeOfHire: String
});

const Developer = mongoose.model('Developer', developerSchema);


export function sendNewDeveloper({ name, email, phone, location, image, pph, currency, technology, description, yoe, language, linkedin, lastUpdated, hired, startDate, endDate }) {
    return new Promise((resolve, reject) => {
        connect().then(() => {
            let developer = new Developer({
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
                lastUpdated: lastUpdated,
                hired: hired,
                startDate: startDate,
                endDate: endDate,
                typeOfHire: ""
            });

            developer.save((error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        }).catch(error => {
            reject(error);
        });
    });
}