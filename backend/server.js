import express from  'express'
import cors from 'cors'
import 'dotenv/config'
import {connectDb} from './src/config/db.js'
import userRouter from './src/routes/userRoutes.js'
import baleRouter from './src/routes/baleRoutes.js'
import expenseRouter from './src/routes/expenseRoutes.js'
import savingRouter from './src/routes/savingRoute.js'
import reportRouter from './src/routes/reportRoutes.js'


//app config
const app = express()


//defining the Port No
const PORT = process.env.PORT || 3000

//middleware
app.use(express.json())
app.use(cors())


//accessing the db
connectDb()




//api endpoints
app.use("/uploads", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/bales", baleRouter)
app.use("/api/expenses", expenseRouter)
app.use("/api/savings", savingRouter)
app.use("/api/reports", reportRouter)





//return message on the browser
app.get('/', (req, res) => {
    res.send("Hello Backend")

})


app.listen( PORT, () => {
    console.log(`Server is running on  http:localhost:${PORT}`)
})