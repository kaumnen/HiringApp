import { connect } from './connect.js';
import mongoose from 'mongoose';

export function hireCheck(devs) {
    return new Promise((resolve, reject) => {
        connect().then(() => {
            var date = new Date();
            devs.forEach(dev => {
                if (dev.endDate.getTime() <= date.getTime()) {
                    mongoose.model('Developer').updateOne({ _id: dev._id.toString() }, { hired: false, typeOfHire: null }, (error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    });
                }
            });
        }).catch(error => {
            reject(error);
        });
    });
}