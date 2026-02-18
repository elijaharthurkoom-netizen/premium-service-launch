import React, { useState } from 'react';

const WaitlistModal = () => {
  const [step, setStep] = useState(0);

  const handleSubmit = (e) => {
    // We let the browser handle the redirect to bypass CORS security
    setStep(4); // Move to success screen immediately
  };

  return (
    <div className="waitlist-modal">
      {step !== 4 ? (
        <>
          <form 
            onSubmit={handleSubmit}
            action="https://emailoctopus.com/lists/d2f8c170-09ec-11f1-8328-295120792464/members/embedded/1.3/add"
            method="POST"
            target="hidden_iframe"
          >
            <input type="email" name="field_0" required placeholder="Email" />
            <input type="text" name="field_1" placeholder="Revenue Goal" />
            <input type="text" name="field_2" placeholder="Hurdles" />
            <input type="text" name="field_3" placeholder="Ad Budget" />
            <button type="submit">Apply</button>
          </form>
          {/* This invisible iframe keeps the user on your site */}
          <iframe name="hidden_iframe" style={{ display: 'none' }}></iframe>
        </>
      ) : (
        <div className="success-message">Success! You are on the list.</div>
      )}
    </div>
  );
};

export default WaitlistModal;
