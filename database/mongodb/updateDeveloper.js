import mongoose from 'mongoose';
import { connect } from './connect.js';

export function updateDeveloper(id, { name, email, phone, location, image, pph, currency, technology, description, yoe, language, linkedin }) {
    return new Promise((resolve, reject) => {
        connect().then(() => {
            let datetime = new Date();
            let lastUpdated = datetime.toLocaleString();

            mongoose.model('Developer').updateOne({ _id: id }, { 
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
                }, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
    });
    }).catch(error => {
        reject(error);
    });
}
