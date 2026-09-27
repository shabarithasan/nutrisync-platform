import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Scale, Target, ChevronRight, ChevronLeft, Check } from 'lucide-react';

const GlassCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`rounded-[28px] backdrop-blur-2xl bg-white/50 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

export function ModernOnboarding({ profile = {}, onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: profile.age || '',
    gender: profile.gender || '',
    height: profile.height || '',
    weight: profile.weight || '',
    targetWeight: profile.targetWeight || '',
    activityLevel: profile.activityLevel || '',
    primaryGoal: profile.primaryGoal || ''
  });
  
  const updateData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStep1Valid = formData.age > 0 && formData.gender !== '';
  const isStep2Valid = formData.height > 0 && formData.weight > 0;
  const isStep3Valid = formData.targetWeight > 0 && formData.activityLevel !== '' && formData.primaryGoal !== '';

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);
  const handleFinish = () => {
    onComplete({ ...profile, ...formData });
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 p-6 text-ink-900">
      <GlassCard className="w-full max-w-2xl p-8 sm:p-12">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-emerald-600">NutriSync Setup</h1>
            <span className="text-emerald-500 font-medium">Step {step} of 3</span>
          </div>
          
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                  i <= step ? 'bg-emerald-500' : 'bg-emerald-200/50'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="min-h-[300px] relative">
          <AnimatePresence mode="wait" custom={1}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                    <User size={24} />
                  </div>
                  <h2 className="text-2xl font-bold">Let's get to know you</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink-500 mb-2">Age</label>
                    <input 
                      type="number"
                      min="1"
                      value={formData.age}
                      onChange={(e) => updateData('age', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="e.g. 28"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-ink-500 mb-2">Gender</label>
                    <div className="flex gap-4">
                      {['Male', 'Female', 'Other'].map(g => (
                        <button
                          key={g}
                          onClick={() => updateData('gender', g)}
                          className={`flex-1 py-3 px-4 rounded-xl border font-medium transition-all ${
                            formData.gender === g 
                              ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                              : 'bg-white/70 border-emerald-200 text-ink-500 hover:bg-emerald-50'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                    <Scale size={24} />
                  </div>
                  <h2 className="text-2xl font-bold">Body Metrics</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink-500 mb-2">Height (cm)</label>
                    <input 
                      type="number"
                      min="1"
                      value={formData.height}
                      onChange={(e) => updateData('height', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g. 175"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-ink-500 mb-2">Weight (kg)</label>
                    <input 
                      type="number"
                      min="1"
                      value={formData.weight}
                      onChange={(e) => updateData('weight', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g. 70"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                    <Target size={24} />
                  </div>
                  <h2 className="text-2xl font-bold">Goals & Lifestyle</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink-500 mb-2">Target Weight (kg)</label>
                    <input 
                      type="number"
                      min="1"
                      value={formData.targetWeight}
                      onChange={(e) => updateData('targetWeight', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-orange-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="e.g. 65"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-ink-500 mb-2">Primary Goal</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {['Lose Weight', 'Maintain', 'Gain Weight'].map(g => (
                        <button
                          key={g}
                          onClick={() => updateData('primaryGoal', g)}
                          className={`py-3 px-4 rounded-xl border font-medium text-sm transition-all ${
                            formData.primaryGoal === g 
                              ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                              : 'bg-white/70 border-orange-200 text-ink-500 hover:bg-orange-50'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ink-500 mb-2">Activity Level</label>
                    <select
                      value={formData.activityLevel}
                      onChange={(e) => updateData('activityLevel', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-orange-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium text-ink-900"
                    >
                      <option value="" disabled>Select your activity level</option>
                      <option value="Sedentary">Sedentary (Little or no exercise)</option>
                      <option value="Light">Light (Exercise 1-3 days/week)</option>
                      <option value="Moderate">Moderate (Exercise 3-5 days/week)</option>
                      <option value="Active">Active (Exercise 6-7 days/week)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-10 flex justify-between pt-6 border-t border-emerald-100">
          <button
            onClick={handlePrev}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              step === 1 ? 'invisible' : 'text-ink-500 hover:bg-emerald-50'
            }`}
          >
            <ChevronLeft size={20} /> Back
          </button>
          
          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
                (step === 1 ? isStep1Valid : isStep2Valid)
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-xl hover:-translate-y-0.5'
                  : 'bg-emerald-200 text-emerald-400 cursor-not-allowed'
              }`}
            >
              Next <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!isStep3Valid}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
                isStep3Valid
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-xl hover:-translate-y-0.5'
                  : 'bg-emerald-200 text-emerald-400 cursor-not-allowed'
              }`}
            >
              Finish & Start <Check size={20} />
            </button>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
