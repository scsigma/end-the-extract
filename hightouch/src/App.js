import React, {useEffect, useState} from 'react';
import { client, useConfig } from '@sigmacomputing/plugin';
import { ChakraProvider, Button, Box } from '@chakra-ui/react';

// ---- Sigma Config -----
client.config.configureEditorPanel([
  { name: "API Token", type: "text"},
  { name: "Sync ID", type: "text"},
  { name: "Button Text", type: "text", defaultValue: "Export to HubSpot"}
]);
// -----------------------

const allSigmaDataReceived = (config) => {
  return config['API Token'] && config['Sync ID'];
}

const App = () => {

  const [apiToken, setApiToken] = useState(null);
  const [syncId, setSyncId] = useState(null);
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
      setSyncId(config['Sync ID']);
    }
  }, [config])



  const triggerSync = async (apiToken, syncId) => {
    // create or update the new campaign list
    // await fetch(`https://api.hightouch.com/api/v1/syncs/${listCreatorSyncId}/trigger`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${apiToken}`
    //   }
    // })

    // Ping the backend node.js with the correct hightouch_sync endpoint and payload
    await fetch(`https://end-the-extract.onrender.com/hightouch_sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'apiToken': apiToken,
        'syncId': syncId
      })
    })
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
      <Box justifyContent="center" display="flex" alignItems="center" paddingTop="9px">
        <Button
        backgroundColor="#ff5c35"
        color="white"
        _hover={{ backgroundColor: "#fff4f2", color: "#ff5c35"}}
        style={{ width: '200px'}}
        onClick={() => {
          if (allSigmaDataReceived) {
            triggerSync(apiToken, syncId)
            handleClick()
          } 
        }}
        ></Button>
        {buttonClicked && 
          <div style={{position: 'absolute', width: '50px', left: '76%'}}>✅</div>
        }
      </Box>
    </ChakraProvider>
  );
}

export default App;