import React, { useState } from 'react';

const SimpleThemeTest = () => {
  const [currentTheme, setCurrentTheme] = useState('banking');

  const themes = {
    banking: { primary: '#1e40af', name: 'Banking' },
    healthcare: { primary: '#059669', name: 'Healthcare' },
    logistics: { primary: '#ea580c', name: 'Logistics' },
    content: { primary: '#7c3aed', name: 'Content Creation' }
  };

  return (
    <div className="min-h-screen bg-base-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Simple Theme Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => setCurrentTheme(key)}
              className={`btn ${currentTheme === key ? 'btn-primary' : 'btn-outline'}`}
              style={currentTheme === key ? { backgroundColor: theme.primary } : { borderColor: theme.primary, color: theme.primary }}
            >
              {theme.name}
            </button>
          ))}
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title" style={{ color: themes[currentTheme].primary }}>
              Current Theme: {themes[currentTheme].name}
            </h2>
            <p>This is a simple theme test without the complex ThemeProvider.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div 
                className="p-4 rounded-lg text-white"
                style={{ backgroundColor: themes[currentTheme].primary }}
              >
                <h3 className="font-bold">Primary Color</h3>
                <p>{themes[currentTheme].primary}</p>
              </div>
              
              <div className="p-4 rounded-lg border-2" style={{ borderColor: themes[currentTheme].primary }}>
                <h3 className="font-bold" style={{ color: themes[currentTheme].primary }}>
                  Themed Border
                </h3>
                <p>This box has a themed border color.</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Test Components:</h3>
              <div className="space-x-2">
                <button className="btn btn-sm" style={{ backgroundColor: themes[currentTheme].primary, color: 'white' }}>
                  Primary Button
                </button>
                <button className="btn btn-outline btn-sm" style={{ borderColor: themes[currentTheme].primary, color: themes[currentTheme].primary }}>
                  Outline Button
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-base-content/70">
            ✅ This simple theme test is working!<br/>
            The issue is with the complex ThemeProvider implementation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleThemeTest;