// Chatbot.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css'; // Import the CSS file for styling
import BasantiImage from './basanti.jpeg'; // Import the image of Basanti


const Chatbot = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

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
      const audioResponse = await axios.post(`http://localhost:3000/test2?question=${encodeURIComponent(question)}`);
      console.log("2", audioResponse.data);
      setResponse(audioResponse.data);
      handleSpeakResponse(audioResponse.data); // Play the chatbot response audio

      // Update the conversation history with both question and complete answer
      setConversationHistory((prevHistory) => [
        ...prevHistory,
        { role: 'user', content: question },
        { role: 'chatbot', content: audioResponse.data },
      ]);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  // Use useEffect to scroll to the latest message when a new response is received
  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [conversationHistory]);

  return (
    <div className='total'>
      <div className="chatbot-container">
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
    </div>
    </div>
    
  );
};

export default Chatbot;
