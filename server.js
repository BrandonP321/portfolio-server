const express = require('express');
const cors = require('cors')
const nodemailer = require('nodemailer');
require('dotenv').config();

const PORT = process.env.PORT || 8000

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({ origin: true }))

app.post('/api/message/send', (req, res) => {
    const { name, email, subject, message } = req.body

    // due to gmail overwriting 'from' field, user's email is added to the 'replyTo' field
    const messageObj = {
        replyTo: email,
        to: process.env.EMAIL,
        subject: subject,
        text: message
    }
    console.log(messageObj)
    console.log(process.env.EMAIL, process.env.PASSWORD)

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })

    transporter.sendMail(messageObj, (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).send('server error').end();
        }

        res.status(200).end()
    })
    
    // res.json('hello')
})

app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT)
})