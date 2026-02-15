
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WaitlistModalProps {
  onClose: () => void;
}

const STEPS = [
  {
    key: 'RevenueGoal',
    question: "What is your current monthly revenue goal?",
    placeholder: "",
    type: "text"
  },
  {
    key: 'Hurdles',
    question: "What is the biggest hurdle currently stopping you?",
    placeholder: "",
    type: "textarea"
  },
  {
    key: 'AdBudget',
    question: "What is your monthly ad budget?",
    placeholder: "",
    type: "text"
  },
  {
    key: 'field_0',
    question: "Finally, where should we send your invitation?",
    placeholder: "",
    type: "email"
  }
];

const WaitlistModal: React.FC<WaitlistModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({
    field_0: '',
    RevenueGoal: '',
    Hurdles: '',
    AdBudget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    const currentKey = STEPS[currentStep].key;
    if (!formData[currentKey]) return; // Basic validation
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitToEmailOctopus();
    }
  };

  const submitToEmailOctopus = () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // List ID provided: d2f8c170-09ec-11f1-8328-295120792464
      const ACTION_URL = "https://emailoctopus.com/lists/d2f8c170-09ec-11f1-8328-295120792464/members/embedded/1.3/add";
      const frameName = `eo_frame_${Date.now()}`;

      // 1. Create hidden iframe to capture the submission redirect
      const iframe = document.createElement('iframe');
      iframe.name = frameName;
      iframe.id = frameName;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      // 2. Create hidden form targeting the iframe
      const form = document.createElement('form');
      form.action = ACTION_URL;
      form.method = 'POST';
      form.target = frameName;
      form.style.display = 'none';

      // 3. Map fields correctly
      // field_0: Email, RevenueGoal, Hurdles, AdBudget
      Object.keys(formData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = formData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);

      // 4. Submit the form
      form.submit();

      // 5. Success state transition
      // Since iframe submission is one-way from client perspective, we transition immediately
      setTimeout(() => {
        setIsSuccess(true);
        setIsSubmitting(false);
        // Clean up DOM after small delay
        if (document.body.contains(form)) document.body.removeChild(form);
        setTimeout(() => {
          if (document.body.contains(iframe)) document.body.removeChild(iframe);
        }, 2000);
      }, 800);

    } catch (err) {
      console.error(err);
      setError("An error occurred while processing. Please try again.");
      setIsSubmitting(false);
    }
  };

  const step = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-onyx/90 backdrop-blur-sm"
      />

      {/* Card Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-onyx border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          <motion.div 
            className="h-full bg-gold shadow-[0_0_10px_#D4AF37]"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl"
        >
          &times;
        </button>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="mt-4"
            >
              <h2 className="text-2xl font-serif text-white mb-6 font-bold leading-tight">
                {step.question}
              </h2>

              {step.type === 'textarea' ? (
                <textarea
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-gold transition-colors resize-none h-32"
                  placeholder={step.placeholder}
                  value={formData[step.key]}
                  onChange={(e) => setFormData(prev => ({ ...prev, [step.key]: e.target.value }))}
                />
              ) : (
                <input
                  autoFocus
                  type={step.type}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-gold transition-colors"
                  placeholder={step.placeholder}
                  value={formData[step.key]}
                  onChange={(e) => setFormData(prev => ({ ...prev, [step.key]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                />
              )}

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              <button
                disabled={isSubmitting || !formData[step.key]}
                onClick={handleNext}
                className="w-full bg-gold text-onyx font-bold py-4 rounded-xl mt-8 hover:bg-gold-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : currentStep === STEPS.length - 1 ? "Complete Application" : "Next Step"}
              </button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                ✓
              </div>
              <h2 className="text-3xl font-serif text-white mb-4">Application Received</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                We've added you to our priority queue for this month's cohort. Our team will review your data and reach out via secure channels.
              </p>
              <button
                onClick={onClose}
                className="text-gold font-semibold hover:underline"
              >
                Return to site
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default WaitlistModal;
