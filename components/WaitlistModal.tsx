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
    key: 'field_0', // Email Field
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
    if (!formData[currentKey]) return;
    
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
      // Direct EmailOctopus Action URL
      const ACTION_URL = "https://emailoctopus.com/lists/d2f8c170-09ec-11f1-8328-295120792464/members/embedded/1.3/add";
      const frameName = `eo_frame_${Date.now()}`;

      // 1. Create hidden iframe to bypass CORS
      const iframe = document.createElement('iframe');
      iframe.name = frameName;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      // 2. Create hidden form
      const form = document.createElement('form');
      form.action = ACTION_URL;
      form.method = 'POST';
      form.target = frameName;
      form.style.display = 'none';

      // 3. Map internal keys to EmailOctopus Merge Tags
      const fieldMapping: Record<string, string> = {
        'field_0': formData.field_0,       // Email
        'field_1': formData.RevenueGoal,   // Revenue Goal
        'field_2': formData.Hurdles,       // Hurdles
        'field_3': formData.AdBudget       // Ad Budget
      };

      Object.entries(fieldMapping).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);

      // 4. Execute the submission
      form.submit();

      // 5. Cleanup and transition
      setTimeout(() => {
        setIsSuccess(true);
        setIsSubmitting(false);
        if (document.body.contains(form)) document.body.removeChild(form);
        setTimeout(() => {
          if (document.body.contains(iframe)) document.body.removeChild(iframe);
        }, 2000);
      }, 1000);

    } catch (err) {
      console.error(err);
      setError("Processing error. Please try again.");
      setIsSubmitting(false);
    }
  };

  const step = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-zinc-900 border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          <motion.div 
            className="h-full bg-white shadow-[0_0_10px_#fff]"
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
              <h2 className="text-2xl font-bold text-white mb-6 leading-tight">
                {step.question}
              </h2>

              {step.type === 'textarea' ? (
                <textarea
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white transition-colors resize-none h-32"
                  value={formData[step.key]}
                  onChange={(e) => setFormData(prev => ({ ...prev, [step.key]: e.target.value }))}
                />
              ) : (
                <input
                  autoFocus
                  type={step.type}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white transition-colors"
                  value={formData[step.key]}
                  onChange={(e) => setFormData(prev => ({ ...prev, [step.key]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                />
              )}

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              <button
                disabled={isSubmitting || !formData[step.key]}
                onClick={handleNext}
                className="w-full bg-white text-black font-bold py-4 rounded-xl mt-8 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="w-20 h-20 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                ✓
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Application Received</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                We've added you to our priority queue. Our team will review your data and reach out via email.
              </p>
              <button
                onClick={onClose}
                className="text-white font-semibold hover:underline"
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
