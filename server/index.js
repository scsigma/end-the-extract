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
    const url = `https://api.hightouch.com/api/v1/syncs/${syncId}/trigger`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            }
        })
        
        if (!response.ok) {
            throw new Error('External API request failed');
        }

        const externalData = await response.json();
        
        // Send back a 200 status
        res.status(200).json({ message: 'Success', externalData});
    } catch (error) {
        // Handle errors that occured during the external API request   
        res.status(500).json({ message: 'Error', error: error.message});
    }
})

// dbt Trigger Sync
app.post('/dbt_sync',  async (req, res) => {
    const {accountId, jobId, apiToken} = req.body;    
    const url = `https://cloud.getdbt.com/api/v2/accounts/${accountId}/jobs/${jobId}/run/`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${apiToken}`
            },
            body: JSON.stringify({
                "cause": "Triggerd via API"
              })
        })
        
        if (!response.ok) {
            throw new Error('External API request failed');
        }

        const externalData = await response.json();
        
        // Send back a 200 status
        res.status(200).json({ message: 'Success', externalData});
    } catch (error) {
        // Handle errors that occured during the external API request   
        res.status(500).json({ message: 'Error', error: error.message});
    }
})



app.listen(port, () => {
    console.log(`Server running on ${port}`)
})