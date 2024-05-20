require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/fliesenlegerfirma', { useNewUrlParser: true, useUnifiedTopology: true });

const Service = mongoose.model('Service', new mongoose.Schema({
    name: String
}));

const Contact = mongoose.model('Contact', new mongoose.Schema({
    name: String,
    email: String,
    message: String
}));

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/api/services', async (req, res) => {
    const services = await Service.find();
    res.json(services);
});

app.post('/api/services', async (req, res) => {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
});

app.put('/api/services/:id', async (req, res) => {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
});

app.delete('/api/services/:id', async (req, res) => {
    await Service.findByIdAndDelete(req.params.id);
    res.status(204).end();
});

app.post('/api/contact', async (req, res) => {
    const contact = new Contact(req.body);
    await contact.save();

    // E-Mail senden
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: process.env.HOTMAIL_USER,
            pass: process.env.HOTMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.HOTMAIL_USER,
        to: process.env.HOTMAIL_USER,
        subject: 'Neue Kontaktanfrage',
        text: `Name: ${req.body.name}\nEmail: ${req.body.email}\nNachricht: ${req.body.message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ message: 'Fehler beim Senden der E-Mail' });
        }
        res.status(201).json({ message: 'Nachricht gesendet und E-Mail verschickt' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
