import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  { key: 'field_1', question: "What is your monthly revenue goal?", type: "number" },
  { key: 'field_2', question: "What is the biggest hurdle currently stopping you?", type: "textarea" },
  { key: 'field_3', question: "What is your monthly ad budget?", type: "number" },
  { key: 'field_0', question: "Where should we send your invitation?", type: "email" }
];

const WaitlistModal = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({ 
    field_0: '', field_1: '', field_2: '', field_3: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentStep = STEPS[step];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Your New Script URL
    const URL = "https://script.google.com/macros/s/AKfycbwbTtK0Sj6zm0Ci8EtW05-6SH4eC03iERxf2Z90BFgUkEy6g6IOTNvmI4n9wRIwURgJsg/exec";
    
    const iframe = document.createElement('iframe');
    iframe.name = "hidden_frame"; 
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.action = URL; 
    form.method = 'POST'; 
    form.target = "hidden_frame"; 
    form.style.display = 'none';

    Object.entries(formData).forEach(([n, v]) => {
      const i = document.createElement('input'); 
      i.type = 'hidden'; 
      i.name = n; 
      i.value = v; 
      form.appendChild(i);
    });

    document.body.appendChild(form);
    form.submit();

    setTimeout(() => { 
      setIsSuccess(true); 
      setIsSubmitting(false); 
      if (document.body.contains(form)) document.body.removeChild(form);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-zinc-900 border border-white/10 w-full max-w-md rounded-3xl p-8 text-white shadow-2xl">
        {!isSuccess ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">{currentStep.question}</h2>
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }}>
                {currentStep.type === 'textarea' ? (
                  <textarea autoFocus className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none h-32" value={formData[currentStep.key]} onChange={(e) => setFormData({...formData, [currentStep.key]: e.target.value})} />
                ) : (
                  <input autoFocus type={currentStep.type} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none" value={formData[currentStep.key]} onChange={(e) => setFormData({...formData, [currentStep.key]: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && step < 3 && setStep(s => s + 1)} />
                )}
              </motion.div>
            </AnimatePresence>
            <button 
              disabled={isSubmitting || !formData[currentStep.key]} 
              onClick={step === 3 ? handleSubmit : () => setStep(s => s + 1)} 
              className="w-full bg-white text-black font-bold py-4 rounded-xl mt-8 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? "Sending..." : step === 3 ? "Complete Application" : "Next Step"}
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">Success!</h2>
            <p className="text-zinc-400">Your application has been sent to the team. We will reach out shortly.</p>
            <button onClick={onClose} className="text-white underline mt-6">Return to site</button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WaitlistModal;
  
