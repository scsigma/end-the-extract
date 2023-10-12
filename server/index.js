const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); 


const port = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(cors())

app.get('/test', (req, res) => {
    res.send({ data: "Hello from the server!"})
})

app.post('/hightouch_sync', async (req, res) => {
    const {apiTokenoken, syncId} = req.body;
    // res.json({ token, syncId})
    await fetch(`https://api.hightouch.com/api/v1/syncs/${syncId}/trigger`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiToken}`
        }
    })

    res.json({ apiToken, syncId})
})

app.listen(port, () => {
    console.log(`Server running on ${port}`)
})