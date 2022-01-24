import { connect } from './connect.js';
import mongoose from 'mongoose';

export function getDeveloperList() {
    return new Promise((resolve, reject) => {
        connect().then(() => {
            mongoose.model('Developer').find({}, (error, developers) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(developers);
                }
            });
        }).catch(error => {
            reject(error);
        });
    });
}