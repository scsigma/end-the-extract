const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');


const port = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(cors())

// Endpoints

// Test
app.get('/test', (req, res) => {
    res.send({ data: "Hello from the server!"})
})

// Hightouch Trigger Sync
app.post('/hightouch_sync',  async (req, res) => {
    const {apiToken, syncId} = req.body;
    // res.json({ token, syncId})
    await fetch(`https://api.hightouch.com/api/v1/syncs/${syncId}/trigger`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiToken}`
        }
    })

    res.json({ apiToken, syncId})
    // i need to send back something better than this, ideally with the status code
})

app.listen(port, () => {
    console.log(`Server running on ${port}`)
})