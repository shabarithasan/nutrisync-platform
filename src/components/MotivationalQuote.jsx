import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const QUOTES = [
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn", category: "wellness" },
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown", category: "fitness" },
  { text: "Let food be thy medicine and medicine be thy food.", author: "Hippocrates", category: "nutrition" },
  { text: "Your body hears everything your mind says. Stay positive.", author: "Unknown", category: "mindset" },
  { text: "Drink water like it's your job.", author: "Unknown", category: "hydration" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "David Goggins", category: "fitness" },
  { text: "The first wealth is health.", author: "Ralph Waldo Emerson", category: "wellness" },
  { text: "To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear.", author: "Buddha", category: "wellness" },
  { text: "Every time you eat or drink, you are either feeding disease or fighting it.", author: "Heather Morgan", category: "nutrition" },
  { text: "A healthy outside starts from the inside.", author: "Robert Urich", category: "wellness" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown", category: "mindset" },
  { text: "Physical fitness is the first requisite of happiness.", author: "Joseph Pilates", category: "fitness" },
  { text: "What you eat in private is what you wear in public.", author: "Unknown", category: "nutrition" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "mindset" },
  { text: "Hydration is the key to life.", author: "Unknown", category: "hydration" },
  { text: "Water is the driving force of all nature.", author: "Leonardo da Vinci", category: "hydration" },
  { text: "It's not about perfect. It's about effort.", author: "Jillian Michaels", category: "fitness" },
  { text: "You are what you eat, so don't be fast, cheap, easy, or fake.", author: "Unknown", category: "nutrition" },
  { text: "Your health is an investment, not an expense.", author: "Unknown", category: "wellness" },
  { text: "If you keep good food in your fridge, you will eat good food.", author: "Errick McAdams", category: "nutrition" },
  { text: "Those who think they have not time for bodily exercise will sooner or later have to find time for illness.", author: "Edward Stanley", category: "fitness" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun", category: "mindset" },
  { text: "Sore today, strong tomorrow.", author: "Unknown", category: "fitness" },
  { text: "A mile a day keeps the doctor away.", author: "Unknown", category: "fitness" },
  { text: "Small changes can make a big difference.", author: "Unknown", category: "mindset" },
  { text: "He who has health has hope, and he who has hope has everything.", author: "Arabian Proverb", category: "wellness" },
  { text: "Fitness is not about being better than someone else. It's about being better than you used to be.", author: "Khloe Kardashian", category: "fitness" },
  { text: "The difference between try and triumph is just a little umph!", author: "Marvin Phillips", category: "mindset" },
  { text: "Nothing tastes as good as healthy feels.", author: "Unknown", category: "nutrition" },
  { text: "Drink a glass of water when you wake up. It's an internal shower.", author: "Unknown", category: "hydration" },
  { text: "You don't have to be extreme, just consistent.", author: "Unknown", category: "mindset" }
];

export function MotivationalQuote({ category, className = '' }) {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    let filteredQuotes = QUOTES;
    if (category) {
      filteredQuotes = QUOTES.filter(q => q.category === category);
    }
    if (filteredQuotes.length === 0) filteredQuotes = QUOTES;
    
    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    setQuote(randomQuote);
  }, [category]);

  return (
    <div className={`rounded-2xl backdrop-blur-2xl bg-white/50 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-6 ${className}`}>
      <AnimatePresence mode="wait">
        {quote && (
          <motion.div
            key={quote.text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center text-center space-y-3"
          >
            <p className="text-lg italic text-ink-900 font-medium">"{quote.text}"</p>
            <p className="text-sm font-bold text-ink-500">— {quote.author}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
