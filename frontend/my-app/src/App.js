import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css'; // Import the CSS file for styling
import { auth, provider } from './firebaseConfig'; // Import the Firebase configuration
import { signInWithPopup } from 'firebase/auth';


const Chatbot = () => {
  const [question, setQuestion] = useState('');
  const [user, setUser] = useState('');
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const apiKey = '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';

  

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth,provider).then((data) => {
        console.log(data);
        setUser(data.user)
        localStorage.setItem("user", data.user)
      })
    } catch (error) {
      console.error('Error occurred while signing in with Google:', error);
    }
  };

  const handleSignOut = async () => { 
    try {
      setUser('')
      localStorage.clear()
    } catch (error) {
      console.error('Error occurred while signing out:', error); 
    }
  };

  const handleSpeakResponse = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    setIsSpeaking(true);

    speech.onend = () => {
      setIsSpeaking(false);
      setResponse('');
    };

    window.speechSynthesis.speak(speech);
  };

  const handleStopAudio = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleVoiceInput = async () => {
    try {
      let recognition;

      if ('webkitSpeechRecognition' in window) {
        // For Chrome and other WebKit-based browsers
        recognition = new window.webkitSpeechRecognition();
      } else if ('SpeechRecognition' in window) {
        // For Firefox
        recognition = new window.SpeechRecognition();
      } else {
        console.error('Speech recognition not supported in this browser.');
        return;
      }

      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);

        // Call handleSubmit with the latest value of question
        handleSubmit(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        recognition.stop();
      };

      recognition.start();
    } catch (error) {
      console.error('Error occurred while accessing microphone:', error);
    }
  };

  const handleSubmit = async (question) => {
    try {
      // Send the question to the backend for speech recognition
      console.log("1", question);
      const audioResponse = await getOpenAIResponse(question);
      console.log("2", audioResponse);
      setResponse(audioResponse);
      handleSpeakResponse(audioResponse); // Play the chatbot response audio

      // Update the conversation history with both question and complete answer
      setConversationHistory((prevHistory) => [
        ...prevHistory,
        { role: 'user', content: question },
        { role: 'chatbot', content: audioResponse },
      ]);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  // Use useEffect to scroll to the latest message when a new response is received
  useEffect(() => {
    const userData = localStorage.getItem("user")
    setUser(userData)
    console.log(userData);
    const chatContainer = document.getElementById('chat-container');
    // chatContainer.scrollTop = chatContainer.scrollHeight;
    
  }, [conversationHistory]);

  const getOpenAIResponse = async (question) => {
    const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-002/completions';

    try {
      const response = await axios.post(
        apiUrl,
        {
          prompt: question,
          max_tokens: 100
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      );

      return response.data.choices[0].text;
    } catch (error) {
      console.error('Error:', error);
      return '';
    }
  };

  return (
    <div className='total'>
      <div className="chatbot-container">
      {user ? (
        <>
                        <div> Welcome {user.displayName} !</div>

                <div>{user.email}</div>
        <button onClick={handleSignOut}>Sign Out</button>
          <h1 className="chatbot-title">Project Basanti</h1>
         
      
      <div id="chat-container" className="chat-container">
        {conversationHistory.map((message, index) => (
          <div key={index} className={`chat-message ${message.role}`}>
            <span>{message.content}</span>
          </div>
        ))}
        {isSpeaking && <div className="speaking-indicator">Speaking...</div>}
      </div>
      <div className="buttons-container">
        <button className="voice-input-button" onClick={handleVoiceInput}>
          Start Voice Input
        </button>
        <button className="stop-audio-button" onClick={handleStopAudio} disabled={!isSpeaking}>
          Stop Audio
        </button>
      </div>
      {response && (
        <div className="full-response">
          <strong>Full Response:</strong> {response}
        </div>
      )}
          {/* Your existing components */}
          
        </>
      ) : (
        <div>
          <h2> To Talk with Basanti you need to sign in first !!!!! </h2>
        <button onClick={handleSignInWithGoogle}>Sign In with Google</button>
        </div>
      )}
      
    </div>
    </div>
    
  );
};

export default Chatbot;
