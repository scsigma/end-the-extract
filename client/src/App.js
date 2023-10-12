import React, {useEffect, useState} from 'react';
import { client, useConfig } from '@sigmacomputing/plugin';
import { ChakraProvider, Button, Box } from '@chakra-ui/react';

// ---- Sigma Config -----
client.config.configureEditorPanel([
  // { name: "source", type: "element"},
  { name: "Hightouch API Token", type: "text"},
  { name: "List Creator syncId", type: "text"},
  { name: "Contact List Update syncId", type: "text"},
  { name: "Button Text", type: "text", defaultValue: "Export to HubSpot"}
]);
// -----------------------

const allSigmaDataReceived = (config) => {
  return config['Hightouch API Token'] && config['List Creator syncId'] && config['Contact List Update syncId'];
}

const App = () => {

  const [apiToken, setApiToken] = useState(null);
  const [listCreatorSyncId, setListCreatorSyncId] = useState(null);
  const [contactSyncId, setContactSyncId] = useState(null);
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
      setApiToken(config['Hightouch API Token']);
      setListCreatorSyncId(config['List Creator syncId']);
      setContactSyncId(config['Contact List Update syncId']);
    }
  }, [config])



  const triggerSync = async (listCreatorSyncId, contactSyncId, apiToken) => {
    // create or update the new campaign list
    // await fetch(`https://api.hightouch.com/api/v1/syncs/${listCreatorSyncId}/trigger`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${apiToken}`
    //   }
    // })

    // THIS IS TESTING THE SERVER
    await fetch(`https://end-the-extract.onrender.com/hightouch_sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'apiToken': apiToken,
        'syncId': contactSyncId
      })
    })

    // create or update the overall contact list
    // await fetch(`https://api.hightouch.com/api/v1/syncs/${contactSyncId}/trigger`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${apiToken}`
    //   }
    // })
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
            triggerSync(listCreatorSyncId, contactSyncId, apiToken)
            handleClick()
          } 
        }}
        >Export to Hubspot</Button>
        {buttonClicked && 
          <div style={{position: 'absolute', width: '50px', left: '76%'}}>✅</div>
        }
      </Box>
    </ChakraProvider>
  );
}

export default App;