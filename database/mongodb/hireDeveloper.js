import mongoose from 'mongoose';
import { connect } from './connect.js';

export function hireDeveloper(id) {
    return new Promise((resolve, reject) => {
        connect().then(() => {

            mongoose.model('Developer').updateOne({ _id: id }, { 
                hired: true
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
