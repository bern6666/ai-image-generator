import { useState } from 'react';
import './App.css';

// Erweiterte Map für die zwei Qualitätsstufen
const resolutionMap = {
  square: {
    label: 'Quadrat (1:1)',
    standard: { w: 768, h: 768 },
    high: { w: 1024, h: 1024 }
  },
  landscape: {
    label: 'Landscape (16:9)',
    standard: { w: 1024, h: 576 },
    high: { w: 1280, h: 720 }
  },
  portrait: {
    label: 'Portrait (9:16)',
    standard: { w: 576, h: 1024 },
    high: { w: 720, h: 1280 }
  },
};

function App() {
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState('landscape');
  const [quality, setQuality] = useState('standard'); // Neuer State für Qualität
  const [model, setModel] = useState('turbo');       // Neuer State für Modell
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setImageUrl(null); 

    // Dimensionen basierend auf Format UND Qualität wählen
    const { w, h } = resolutionMap[ratio][quality];
    
    const qualityBoost = ", cinematic, highly detailed, sharp focus";
    const fullPrompt = encodeURIComponent(prompt + qualityBoost);
    const seed = Math.floor(Math.random() * 1000000);
    
    // URL mit dynamischem Modell und Dimensionen
    const finalUrl = `https://pollinations.ai/p/${fullPrompt}?width=${w}&height=${h}&seed=${seed}&model=${model}&nologo=true`;

    setTimeout(() => {
        setImageUrl(finalUrl);
    }, 50);
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    window.open(imageUrl, '_blank');
  };

  return (
    <div className="container">
      <h1>AI Image Creator</h1>
      
      <div className="controls-wrapper">
        <textarea
          className="prompt-input"
          placeholder="Beschreibe dein Bild..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />

        <div className="settings-grid">
          <div className="select-container">
            <label className="select-label">Modell</label>
            <select value={model} onChange={(e) => setModel(e.target.value)} className="format-select">
              <option value="turbo">Turbo (Variantenreich)</option>
              <option value="flux">Flux (Detailreich)</option>
              <option value="flux-realism">Flux Realism (Foto)</option>
            </select>
          </div>

          <div className="select-container">
            <label className="select-label">Format</label>
            <select value={ratio} onChange={(e) => setRatio(e.target.value)} className="format-select">
              {Object.keys(resolutionMap).map((key) => (
                <option key={key} value={key}>{resolutionMap[key].label}</option>
              ))}
            </select>
          </div>

          <div className="select-container">
            <label className="select-label">Qualität</label>
            <select value={quality} onChange={(e) => setQuality(e.target.value)} className="format-select">
              <option value="standard">Standard (Schnell)</option>
              <option value="high">Hoch (HD)</option>
            </select>
          </div>
        </div>
        
        <button 
          className="generate-btn-full" 
          onClick={handleGenerate} 
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? 'Wird generiert...' : 'Bild erstellen'}
        </button>
      </div>

      <div className="image-display-area">
        {isLoading && <div className="spinner"></div>}
        {imageUrl && (
          <div className="result-container">
            <img 
              src={imageUrl} 
              alt="AI" 
              className={`result-image ${isLoading ? 'hidden' : ''}`}
              onLoad={() => setIsLoading(false)}
            />
            {!isLoading && (
              <div className="action-row">
                <button className="download-btn" onClick={downloadImage}>
                  Vollbild / Speichern
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;