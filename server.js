const OktaSdk = require('@okta/okta-sdk-nodejs');
const express = require('express');
const fs = require('fs')
const path = require('path')

const app = express();

const openai = require('openai');
const axios = require('axios');
const FormData = require('form-data');

const filePath = path.join(__dirname, "audio.mp3")
const model = "whisper-1"

const formData = new FormData();
formData.append("model", model);
formData.append("file", fs.createReadStream(filePath))

app.post('/test', async (req, res) => {

    console.log("comming here");

    const apiKey = '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';
  const apiUrl = 'https://api.openai.com/v1/audio/transcriptions';
  const response = await axios.post(apiUrl, formData, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
    }
  });
  console.log(response.data.text);

  res.send(response.data.text)

  });

const OPENAI_API_KEY = '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';

async function getOpenAIResponse2(question) {
    const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-002/completions';
  
    const response = await axios.post(
      apiUrl,
      {
        prompt: question,
        max_tokens: 100
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    console.log(response.data);
  
    return response.data.choices[0].text;
  }
  
  

  
  app.post('/test2', async (req, res) => {

    console.log("comming here");
    const question = "best places to visit in delhi";
    getOpenAIResponse2(question)
      .then(response => {
        console.log("OpenAI Response:", response);
        res.send(response)
      })
      .catch(error => {
        console.error("Error:", error);
      });

      

  });


// const oktaClient = new OktaSdk.Client({
//   orgUrl: 'https://{your-okta-domain}',
//   token: '{your-okta-api-token}'
// });



// app.get('/login', (req, res) => {
//   // Redirect the user to the Okta login page
//   const authUrl = oktaClient.getIdentityProviderRedirect({
//     sessionToken: req.sessionToken,
//     idpId: '0oaxxxxxxxxxxxxx' // Replace with your Okta IDP ID
//   });
//   res.redirect(authUrl);
// });

// app.get('/callback', (req, res) => {
//   // Handle the Okta callback after successful authentication
//   const sessionToken = req.query.token;
//   // Store the session token securely for future API calls
//   req.sessionToken = sessionToken;
//   res.send('Login successful!');
// });

app.get('/start-conversation', async (req, res) => {
//   if (!req.sessionToken) {
//     // Redirect to login if the user is not authenticated
//     return res.redirect('/login');
//   }

  // Prompt the user to ask a question
  res.send('What is your question?');
});

app.post('/process-audio', async (req, res) => {
  const audioBuffer = req.body.audio; // Assuming you're using a middleware to parse the audio
  const question = await transcribeAudio(audioBuffer);

  // Generate a response using ChatGPT
  const response = await generateChatResponse(question);

  res.send(response);
});


async function transcribeAudio(audioBuffer) {
  const apiKey = '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';
  const apiUrl = 'https://api.openai.com/v1/speech/transcriptions';
  const response = await axios.post(apiUrl, {
    audio: audioBuffer.toString('base64'),
    model: 'whisper',
    language: 'en',
    format: 'wav'
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });
  const { text } = response.data[0];
  return text;
}

async function generateChatResponse(question) {
  const response = await openaiClient.complete({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a fortune teller.' },
      { role: 'user', content: question }
    ],
    max_tokens: 50,
    n: 1,
    stop: '\n'
  });

  const answer = response.choices[0].message.content;
  return answer;
}

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

