import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import quizRoutes from './routes/quizRoutes.js';
import userRoutes from './routes/userRoutes.js'

import { notFound, errorHandler } from './middleware/errorMiddleware.js'
dotenv.config()
connectDB()
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3500
const NODE_EN=process.env.NODE_ENV||`http://localhost:`
app.get('/', (req, res) => {
    res.send('API is running')
})
app.use('/api/quiz', quizRoutes);
app.use('/api/users', userRoutes)
app.use(notFound);
app.use(errorHandler);
app.listen(PORT, console.log(`server running in on port ${NODE_EN}${PORT} `))
