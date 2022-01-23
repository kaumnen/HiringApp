import mongoose from 'mongoose';
import 'dotenv/config';

export async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(error);
    }
}