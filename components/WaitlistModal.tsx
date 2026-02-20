import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WaitlistModalProps { onClose: () => void; }

const STEPS = [
  { key: 'field_1', question: "What is your monthly revenue goal? (Numbers only)", type: "number" },
  { key: 'field_2', question: "What is the biggest hurdle stopping you?", type: "textarea" },
  { key: 'field_3', question: "What is your monthly ad budget? (Numbers only)", type: "number" },
  { key: 'field_0', question: "Where should we send your invitation?", type: "email" }
];

const WaitlistModal: React.FC<WaitlistModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({
    field_0: '', field_1: '', field_2: '', field_3: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const step = STEPS[currentStep];

  // Validation: Check if the answer is a valid number for numerical steps
  const isValid = () => {
    const value = formData[step.key];
    if (!value) return false;
    if (step.type === 'number') return !isNaN(Number(value)) && Number(value) >= 0;
    return true;
  };

  const handleNext = () => {
    if (!isValid()) return;
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitData();
    }
  };

  const submitData = () => {
    setIsSubmitting(true);
    const scriptURL = "https://script.google.com/macros/s/AKfycbx3NpDUIEYZqUwdkwX1tNK_Fpz09Ixf20WEwffXF97VUXMOQsbkvtYYDKIL2tjwti3gtA/exec";
    const iframe = document.createElement('iframe');
    iframe.name = "gs_frame"; iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.action = scriptURL; form.method = 'POST'; form.target = "gs_frame"; form.style.display = 'none';

    Object.entries(formData).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden'; input.name = name; input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

    setTimeout(() => {
      setIsSuccess(true);
      setIsSubmitting(false);
      document.body.removeChild(form);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90">
      <motion.div className="bg-zinc-900 border border-white/10 w-full max-w-md rounded-3xl p-8 text-white">
        {!isSuccess ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">{step.question}</h2>
            {step.type === 'textarea' ? (
              <textarea autoFocus className="w-full bg-white/5 border border-white/10 rounded-xl p-4" value={formData[step.key]} onChange={(e) => setFormData({...formData, [step.key]: e.target.value})} />
            ) : (
              <input autoFocus type={step.type} className="w-full bg-white/5 border border-white/10 rounded-xl p-4" value={formData[step.key]} onChange={(e) => setFormData({...formData, [step.key]: e.target.value})} />
            )}
            <button disabled={!isValid() || isSubmitting} onClick={handleNext} className="w-full bg-white text-black font-bold py-4 rounded-xl mt-8 disabled:opacity-50">
              {isSubmitting ? "Processing..." : currentStep === 3 ? "Complete" : "Next Step"}
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Success!</h2>
            <p className="text-zinc-400">Data saved to Google Sheets.</p>
            <button onClick={onClose} className="mt-6 underline">Close</button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WaitlistModal;
