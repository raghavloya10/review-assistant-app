import { useState } from "react";
import "../styles/ReviewAssistant.css";
// The main component for our review assistant app.
const ReviewAssistant = () => {
  const [review, setReview] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // NEW: State to store the selected emotion.
  const [emotion, setEmotion] = useState("polite");
  // This function handles the submission of the review.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review) {
      setError("Please enter a review to generate a response.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(""); // Clear previous response
    // NEW: Incorporate the selected emotion into the prompt.
    const prompt = `You are a professional customer service assistant for a local business named CREO Solutions (Contact: +91 98765 56789).
      The following is a customer review. Please generate a helpful, ${emotion}, and professional response without asking questions.
      Do not use any placeholders. Use generic words like valued customer etc.
      The message should also convey the action being taken as part of the review.

    Customer Review: "${review}"

    Assistant Response:`;

    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = "AIzaSyATqkGdkBB3FD8fSIu_m59UQ6ZRlAeCtVE";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const callApiWithRetry = async (
      url,
      options,
      retries = 3,
      delay = 1000
    ) => {
      try {
        const res = await fetch(url, options);
        if (res.status === 429 && retries > 0) {
          console.warn(`Rate limit exceeded. Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return callApiWithRetry(url, options, retries - 1, delay * 2);
        }
        if (!res.ok) {
          throw new Error(`API call failed with status: ${res.status}`);
        }
        return res;
      } catch (e) {
        if (retries > 0) {
          console.warn(`API call failed. Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return callApiWithRetry(url, options, retries - 1, delay * 2);
        }
        throw e;
      }
    };

    try {
      const response = await callApiWithRetry(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const text = result.candidates[0].content.parts[0].text;
        setResponse(text);
      } else {
        setError("Unexpected API response structure.");
        console.error("Unexpected API response:", result);
      }
    } catch (e) {
      setError(`Failed to generate response. Error: ${e.message}`);
      console.error("Error during API call:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="main-card">
        {/* <h1 className="company-name"> CREO Solutions </h1> */}
        {/* <h2 className="main-title">Review Response Assistant</h2> */}
        <p className="main-subtitle">
          Generate a professional and 
          <span>
            <select
                id="emotion-select"
                className="emotion-select"
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
              >
              <option value="polite">Polite</option>
              <option value="empathetic">Empathetic</option>
              <option value="formal">Formal</option>
              <option value="upbeat">Upbeat</option>
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
              <option value="calm">Calm</option>
              <option value="humble">Humble</option>
              <option value="confident">Confident</option>
              <option value="funny">Funny</option>
            </select>
          </span>
           response to any customer review.
        </p>
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
          <div style={{ display: "block" }}>
            <button
              type="submit"
              className="generate-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="spinner"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Generate Response"
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
export default ReviewAssistant;