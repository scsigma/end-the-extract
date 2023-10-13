import React, {useEffect, useState} from 'react';
import { client, useConfig } from '@sigmacomputing/plugin';
import { ChakraProvider, Button, Box } from '@chakra-ui/react';
import HightouchLogo from './graphics/ht_logo.png';

// ---- Sigma Config -----
client.config.configureEditorPanel([
  { name: "API Token", type: "text"},
  { name: "Account ID", type: "text"},
  { name: "Job ID", type: "text"},
  { name: "Button Text", type: "text", defaultValue: "Run dbt Job"}
]);
// -----------------------

const allSigmaDataReceived = (config) => {
  return config['API Token'] && config['Account ID'] && config['Job ID'];
}

const App = () => {

  const [apiToken, setApiToken] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [allData, setAllData] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  // sigma stuff
  const config = useConfig();
  if (!allSigmaDataReceived(config)) {
    // this means that data is missing from the config panel in Sigma
    console.log('DATA IS MISSING')
  }


  useEffect(() => {
    setAllData(allSigmaDataReceived(config))
    if (allData) {
      setApiToken(config['API Token']);
      setAccountId(config['Account ID']);
      setJobId(config['Job ID']);
    }
  }, [config])



  const triggerSync = async (apiToken, syncId) => {
    // Ping the backend node.js with the correct hightouch_sync endpoint and payload
    try {
      const response = await fetch(`https://end-the-extract.onrender.com/hightouch_sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'apiToken': apiToken,
          'syncId': syncId
        })
      })

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Error: ', error);
    }
  }

  const handleClick = () => {
    setButtonClicked(true);

    // set the button clicked back to false so the icon goes away
    setTimeout(() => {
      setButtonClicked(false);
    }, 5000); // 5000ms = 5s
  }

  return (
    <ChakraProvider>
      <Box justifyContent="center" display="flex" alignItems="center" paddingTop="1px" paddingBottom="1px" style={{"backgroundColor":"#333333"}}>
        <div style={{"display":"flex", "width":"300px"}}>
          <div>
            <img className='logo' src={HightouchLogo}></img>
          </div>
          <div style={{"display":"flex", "alignItems":"center"}}>
            <Button
            backgroundColor="#55c470"
            color="white"
            _hover={{ backgroundColor: "#ccf240", color: "#219d76"}}
            style={{ width: '200px' }}
            onClick={() => {
              if (allSigmaDataReceived) {
                triggerSync(apiToken, accountId, jobId)
                handleClick()
              } 
            }}
            >
              {config['Button Text'] || "Export to HubSpot"}
            </Button>
          </div>
          <div style={{"display":"flex","alignItems":"center","justifyContent":"center","width":"150px"}}>
            <div style={{"width":"25px", "height":"25px", "display":"flex", "justifyContent":"center","alignItems":"center"}}>
              {buttonClicked && 
                <p style={{position: 'absolute', fontSize: '20px'}}>✅</p>
              }
            </div>
          </div>
        </div>
      </Box>
    </ChakraProvider>
  );
}

export default App;