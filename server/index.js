const express = require('express');

const port = process.env.PORT || 3001;

const app = express();
app.use(express.json());

app.get('/test', (req, res) => {
    res.send({ data: "Hello from the server!"})
})

app.post('/hightouch_sync', (req, res) => {
    const {token, syncId} = req.body;
    res.json({ token, syncId})
    // fetch('https://api.hightouch.com/api/v1/syncs/1644239/trigger')
})

app.listen(port, () => {
    console.log(`Server running on ${port}`)
})