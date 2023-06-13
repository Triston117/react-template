import React from "react";

const RandomQuote = ({ quote, onNewQuote, color }) => {
  return (
    <div className="random-quote">
      {quote && (
        <div className="quote-card" style={{ backgroundColor: color }}>
          <div className="quote-text">{quote.text}</div>
          <div className="quote-author">- {quote.author || "Unknown"}</div>
        </div>
      )}
      <button className="new-quote-btn" onClick={onNewQuote}>
        New Quote
      </button>
    </div>
  );
};

export default RandomQuote;
