import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';

const CATEGORY_KEYWORDS = {
  'Produce': ['apple', 'spinach', 'tomato', 'lettuce', 'onion', 'garlic', 'carrot', 'broccoli', 'pepper', 'banana', 'berr', 'lemon', 'lime', 'potato', 'avocado', 'mushroom', 'zucchini', 'cucumber', 'grape', 'orange'],
  'Meat & Protein': ['chicken', 'beef', 'pork', 'salmon', 'fish', 'tuna', 'turkey', 'egg', 'tofu', 'bean', 'lentil', 'chickpea', 'shrimp', 'lamb'],
  'Dairy': ['cheese', 'milk', 'yogurt', 'butter', 'cream', 'ghee'],
  'Pantry': ['rice', 'oat', 'oil', 'pasta', 'flour', 'sugar', 'salt', 'spice', 'sauce', 'bread', 'nut', 'seed', 'quinoa', 'vinegar', 'honey', 'maple', 'cereal', 'almond', 'walnut', 'peanut']
};

function categorizeIngredient(ingredient) {
  const lower = ingredient.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return category;
    }
  }
  return 'Other';
}

export function ModernGroceryList({ isOpen, onClose, weeklyPlan = [] }) {
  const [groceryList, setGroceryList] = useState({});
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const allIngredients = new Set();
      
      weeklyPlan.forEach(day => {
        if (day.meals && Array.isArray(day.meals)) {
          day.meals.forEach(meal => {
            if (meal.ingredients && Array.isArray(meal.ingredients)) {
              meal.ingredients.forEach(ing => allIngredients.add(ing.trim()));
            }
          });
        }
      });

      const categorized = {
        'Produce': [],
        'Meat & Protein': [],
        'Dairy': [],
        'Pantry': [],
        'Other': []
      };

      allIngredients.forEach(ing => {
        if (ing) {
          const category = categorizeIngredient(ing);
          categorized[category].push(ing);
        }
      });

      // Sort ingredients within categories
      Object.keys(categorized).forEach(key => {
        categorized[key].sort((a, b) => a.localeCompare(b));
      });

      setGroceryList(categorized);
    }
  }, [isOpen, weeklyPlan]);

  const toggleItem = (item) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(item)) {
        newSet.delete(item);
      } else {
        newSet.add(item);
      }
      return newSet;
    });
  };

  const copyToClipboard = () => {
    let textToCopy = 'Weekly Grocery List\n\n';
    Object.entries(groceryList).forEach(([category, items]) => {
      if (items.length > 0) {
        textToCopy += `${category}:\n`;
        items.forEach(item => {
          const check = checkedItems.has(item) ? '[x]' : '[ ]';
          textToCopy += `${check} ${item}\n`;
        });
        textToCopy += '\n';
      }
    });

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md max-h-[85vh] bg-white rounded-[28px] shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Weekly Grocery List</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {Object.entries(groceryList).map(([category, items]) => {
                if (items.length === 0) return null;
                return (
                  <div key={category} className="space-y-3">
                    <h3 className="font-semibold text-emerald-600 border-b border-emerald-100 pb-2">
                      {category}
                    </h3>
                    <ul className="space-y-2">
                      {items.map((item, idx) => {
                        const isChecked = checkedItems.has(item);
                        return (
                          <li
                            key={idx}
                            className="flex items-start gap-3 cursor-pointer group"
                            onClick={() => toggleItem(item)}
                          >
                            <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-colors flex-shrink-0 ${isChecked ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 group-hover:border-emerald-400'}`}>
                              {isChecked && <Check size={14} className="text-white" />}
                            </div>
                            <span className={`text-gray-700 transition-all ${isChecked ? 'line-through text-gray-400' : ''}`}>
                              {item}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
              
              {Object.values(groceryList).every(items => items.length === 0) && (
                <div className="text-center py-10 text-gray-500">
                  <p>Your grocery list is empty.</p>
                  <p className="text-sm mt-1">Add some meals to your weekly plan first!</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-4 rounded-xl transition-colors active:bg-emerald-700 disabled:opacity-50"
                disabled={Object.values(groceryList).every(items => items.length === 0)}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
