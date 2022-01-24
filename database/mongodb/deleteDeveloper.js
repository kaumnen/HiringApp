import mongoose from 'mongoose';
import { connect } from './connect.js';

export function deleteDeveloper(email) {
    return new Promise((resolve, reject) => {
        connect().then(() => {
            mongoose.model('Developer').deleteOne({ email: email }, (error) => {
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
