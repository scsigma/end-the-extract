import React, {useEffect, useState} from 'react';
import { client, useConfig } from '@sigmacomputing/plugin';
import { ChakraProvider, Button, Box } from '@chakra-ui/react';
import HightouchLogo from './graphics/ht_logo.png';

// ---- Sigma Config -----
client.config.configureEditorPanel([
  { name: "API Token", type: "text"},
  { name: "List Creation Sync ID", type: "text"},
  { name: "Contact List Update ID", type: "text"},
  { name: "Button Text", type: "text", defaultValue: "Export to HubSpot"},
  { name: "Background Color (HEX code)", type: "text", defaultValue: "#ffffff"}
]);
// -----------------------

const allSigmaDataReceived = (config) => {
  return config['API Token'] && config['List Creation Sync ID'] && config['Contact List Update ID'];
}

const App = () => {

  const [apiToken, setApiToken] = useState(null);
  const [listCreationId, setListCreationId] = useState(null);
  const [contactUpdateId, setContactUpdateId] = useState(null);
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
      setListCreationId(config['List Creation Sync ID']);
      setContactUpdateId(config['Contact List Update ID']);
    }
  }, [config])



  const triggerSync = async (apiToken, listCreationId, contactUpdateId) => {
    // Ping the backend node.js with the correct hightouch_sync endpoint and payload
    try {

      // Runs the sync for the List Creation
      const listCreationResponse = await fetch(`https://end-the-extract.onrender.com/hightouch_sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'apiToken': apiToken,
          'syncId': listCreationId
        })
      })

      if (!listCreationResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const listCreationData = await listCreationResponse.json();
      // console.log('List Creation Response ', listCreationData)

      // Runs the sync for the List Creation
      const contactUpdateResponse = await fetch(`https://end-the-extract.onrender.com/hightouch_sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'apiToken': apiToken,
          'syncId': contactUpdateId
        })
      })

      if (!contactUpdateResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const contactUpdateData = await contactUpdateResponse.json();
      // console.log('Contact Update Response ', contactUpdateData)


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
      <Box justifyContent="center" display="flex" alignItems="center" paddingTop="1px" paddingBottom="1px" backgroundColor={config['Background Color (HEX code)'] || "#ffffff"}>
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
                triggerSync(apiToken, listCreationId, contactUpdateId)
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