import { useState } from 'react';

// The main component for our review assistant app.
const App = () => {
  const [review, setReview] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // This function handles the submission of the review.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review) {
      setError("Please enter a review to generate a response.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(''); // Clear previous response

    // The prompt for the AI model to generate a professional and helpful response to a review.
    const prompt = `You are a professional customer service assistant for a local business named CREO Solutions (Contact: +91 98765 56789). 
      The following is a customer review. Please generate a helpful, positive, polite response without asking questions. 
      Do not use any placeholders. Use generic words like valued customer etc.
    
    Customer Review: "${review}"
    
    Assistant Response:`;

    // The chat history to send to the API.
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };

    // The API key is handled by the Canvas environment.
    const apiKey = "AIzaSyATqkGdkBB3FD8fSIu_m59UQ6ZRlAeCtVE";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    // A simple function to handle retries with exponential backoff.
    const callApiWithRetry = async (url, options, retries = 3, delay = 1000) => {
      try {
        const res = await fetch(url, options);
        if (res.status === 429 && retries > 0) {
          console.warn(`Rate limit exceeded. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return callApiWithRetry(url, options, retries - 1, delay * 2);
        }
        if (!res.ok) {
          throw new Error(`API call failed with status: ${res.status}`);
        }
        return res;
      } catch (e) {
        if (retries > 0) {
          console.warn(`API call failed. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return callApiWithRetry(url, options, retries - 1, delay * 2);
        }
        throw e;
      }
    };
    
    try {
      const response = await callApiWithRetry(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setResponse(text);
      } else {
        setError('Unexpected API response structure.');
        console.error('Unexpected API response:', result);
      }
    } catch (e) {
      setError(`Failed to generate response. Error: ${e.message}`);
      console.error('Error during API call:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <style>
        {`
        /* Resetting default body and HTML margins to ensure full viewport coverage */
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
        }

        /* Import custom fonts for a clean, modern look */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
        
        .app-container {
          min-height: 100vh;
          background-color: #f1f5f9; /* Changed to a lighter gray background color */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          font-family: 'Helvetica', sans-serif;
          box-sizing: border-box;
          width: 100%; /* Ensure it takes full width */
        }

        .main-card {
          width: 100%;
          max-width: 42rem; /* 672px */
          background-color: #ffffff;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-radius: 1.5rem; /* rounded-2xl */
          padding: 2.5rem;
          border: 1px solid #e2e8f0; /* slate-200 */
          box-sizing: border-box;
        }

        .main-title {
          font-size: 2rem; /* 36px */
          font-weight: 700; /* font-bold */
          text-align: center;
          color: #1e293b; /* slate-800 */
          margin-bottom: 0.5rem;
          font-family: "Montserrat", sans-serif;
          font-optical-sizing: auto;
          font-style: italic;
        }

        .company-name {
          font-size: 2.5rem; /* 36px */
          font-weight: 700; /* font-bold */
          text-align: center;
          color: #1e293b; /* slate-800 */
          margin-bottom: 0.5rem;
        }

        .main-subtitle {
          text-align: center;
          color: #64748b; /* slate-500 */
          margin-bottom: 2rem;
        }

        .form-section {
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }

        .form-label {
          display: block;
          font-size: 1rem;
          font-style: italic;
          font-style: bolder;
          color: #334155; /* slate-700 */
          width: 100%;
        }

        .review-textarea {
          width: 100%;
          border: 1px solid #cbd5e1; /* slate-300 */
          border-radius: 0.5rem;
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
          transition-property: all;
          transition-duration: 200ms;
          resize: none;
          font-size: 1rem;
          font-family: 'Roboto', sans-serif; /* Changed textbox font */
          background-color: white;
          color: black;
          height: 10vh;
          padding: 10px;
        }

        .review-textarea:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          border-color: #6366f1; /* indigo-500 */
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5); /* ring-indigo-500 */
        }
        
        .generate-button {
          width: 100%;
          padding: 1rem 1.5rem;
          border-width: 1px;
          border-color: transparent;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          font-size: 1.125rem;
          font-weight: 600;
          color: #ffffff;
          background-color: #4f46e5; /* indigo-600 */
          transition-property: all;
          transition-duration: 200ms;
          cursor: pointer;
          margin-top: 12px;
        }

        .generate-button:hover {
          background-color: #4338ca; /* indigo-700 */
        }

        .generate-button:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5); /* ring-indigo-500 */
        }
        
        .generate-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .spinner {
          animation: spin 1s linear infinite;
          height: 1.5rem;
          width: 1.5rem;
          color: #ffffff;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .error-message {
          margin-top: 1.5rem;
          padding: 1rem;
          border-radius: 0.5rem;
          background-color: #fef2f2; /* red-50 */
          border: 1px solid #fca5a5; /* red-300 */
          color: #b91c1c; /* red-700 */
        }

        .generated-response-section {
          margin-top: 2rem;
        }

        .generated-response-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b; /* slate-800 */
          margin-bottom: 0.75rem;
        }

        .generated-response-content {
          background-color: #f8fafc; /* slate-50 */
          padding: 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0; /* slate-200 */
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
        }

        .generated-response-text {
          color: #334155; /* slate-700 */
          white-space: pre-wrap;
          line-height: 1.625; /* leading-relaxed */
        }
        `}
      </style>
      <div className="main-card">
        <h1 className="company-name">CREO Solutions</h1>
        <h2 className="main-title">Review Response Assistant</h2>
        <p className="main-subtitle">Generate a professional and polite response to any customer review.</p>
        <form onSubmit={handleSubmit} className="form-section">
          <div>
            <label htmlFor="review-input" className="form-label">
              <h3>Enter Customer Review: </h3>
            </label>
            <textarea
              id="review-input"
              className="review-textarea"
              rows="6"
              placeholder="e.g., 'The service was great, but the food was a bit cold.'"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            ></textarea>
          </div>
          <div style={{display: "block"}}>
            <button
              type="submit"
              className="generate-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Generate Response'
              )}
            </button>
          </div>
          
        </form>

        {error && (
          <div className="error-message">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {response && (
          <div className="generated-response-section">
            <h2 className="generated-response-title">Generated Response</h2>
            <div className="generated-response-content">
              <p className="generated-response-text">{response}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
