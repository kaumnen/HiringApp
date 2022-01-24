import mongoose from 'mongoose';
import { connect } from './connect.js';

export function hireDeveloper(id, typeOfHire, startDate, endDate) {
    return new Promise((resolve, reject) => {
        connect().then(() => {
            mongoose.model('Developer').updateOne({ _id: id }, { 
                hired: true,
                typeOfHire: typeOfHire,
                startDate: startDate,
                endDate: endDate
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
