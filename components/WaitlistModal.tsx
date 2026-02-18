import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WaitlistModal = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState(["", "", ""]);

  const STEPS = [
    "What is your current monthly revenue goal?",
    "What is the biggest hurdle currently stopping you?",
    "What is your monthly ad budget?",
    "Finally, where should we send your invitation?"
  ];

const handleSubmit = (e) => {
  // We do NOT use e.preventDefault() here so the browser can bypass CORS
  const form = e.target;
  form.action = 'https://emailoctopus.com/lists/d2f8c170-09ec-11f1-8328-295120792464/members/embedded/1.3/add';
  form.method = 'POST';
  // This sends the data directly to your list
};


    const form = document.createElement('form');
    form.target = 'hidden_frame';
    form.action = 'https://script.google.com/macros/s/AKfycbx3NpDUIEYZqUwdkwX1tNK_Fpz098xf20WEwffXF97VUXMOQsbkvtYYDKlL2tjwti3gtA/exec';
    form.method = 'POST';

    // This is the bridge to your EmailOctopus fields
    const data = {
      'field_0': email,
      'field_1': answers[0], // Revenue Goal
      'field_2': answers[1], // Hurdles
      'field_3': answers[2]  // Ad Budget
    };

    Object.entries(data).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80">
      <div className="bg-zinc-900 border border-white/10 p-8 rounded-2xl max-w-md w-full text-white">
        {!isSuccess ? (
          <>
            <h2 className="text-xl font-bold mb-4">{STEPS[currentStep]}</h2>
            {currentStep < 3 ? (
              <input 
                className="w-full bg-white/5 border border-white/10 p-3 rounded mb-4"
                value={answers[currentStep]} 
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[currentStep] = e.target.value;
                  setAnswers(newAnswers);
                }}
              />
            ) : (
              <input 
                type="email"
                className="w-full bg-white/5 border border-white/10 p-3 rounded mb-4"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
            <button 
              className="w-full bg-yellow-500 text-black font-bold p-3 rounded"
              onClick={() => currentStep < 3 ? setCurrentStep(currentStep + 1) : handleSubmit()}
            >
              {currentStep < 3 ? "Next" : "Complete"}
            </button>
          </>
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">Success!</h2>
            <p>We have received your application.</p>
            <button onClick={onClose} className="mt-4 text-yellow-500">Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitlistModal;
                    
