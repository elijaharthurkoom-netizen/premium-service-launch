import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WaitlistModalProps {
  onClose: () => void;
}

const STEPS = [
  "What is your current monthly revenue goal?",
  "What is the biggest hurdle currently stopping you?",
  "What is your monthly ad budget?",
  "Finally, where should we send your invitation?"
];

const WaitlistModal: React.FC<WaitlistModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(['', '', '']);
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Your verified Web App URL from Screenshot 24.14
    const scriptURL = "https://script.google.com/macros/s/AKfycbx3NpDUIEYZqUwdkwX1tNK_Fpz09Ixf20WEwffXF97VUXMOQsbkvtYYDKIL2tjwti3gtA/exec";
    
    const iframe = document.createElement('iframe');
    iframe.name = "hidden_iframe";
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.action = scriptURL;
    form.method = 'POST';
    form.target = "hidden_iframe";
    form.style.display = 'none';

    // Mapping to your Apps Script parameters
    const data: Record<string, string> = {
      'field_0': email,      // Email
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

    // Smooth transition to Success UI
    setTimeout(() => {
      setIsSuccess(true);
      setIsSubmitting(false);
      document.body.removeChild(form);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-zinc-900 border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl text-white"
      >
        {!isSuccess ? (
          <form onSubmit={currentStep === 3 ? handleSubmit : (e) => e.preventDefault()}>
            <h2 className="text-2xl font-bold mb-6">{STEPS[currentStep]}</h2>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
              >
                {currentStep < 3 ? (
                  <input
                    autoFocus
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 mb-4 outline-none focus:border-white transition-colors"
                    value={answers[currentStep]}
                    onChange={(e) => {
                      const newAnswers = [...answers];
                      newAnswers[currentStep] = e.target.value;
                      setAnswers(newAnswers);
                    }}
                  />
                ) : (
                  <input
                    autoFocus
                    type="email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 mb-4 outline-none focus:border-white transition-colors"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <button
              type={currentStep === 3 ? "submit" : "button"}
              onClick={currentStep === 3 ? undefined : handleNext}
              disabled={isSubmitting || (currentStep < 3 ? !answers[currentStep] : !email)}
              className="w-full bg-white text-black font-bold py-4 rounded-xl mt-4 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : currentStep === 3 ? "Complete Application" : "Next Step"}
            </button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">Application Received</h2>
            <p className="text-zinc-400 mb-6">We've saved your details to our Google Sheet. We'll be in touch soon!</p>
            <button onClick={onClose} className="text-white underline">Back to site</button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WaitlistModal;
