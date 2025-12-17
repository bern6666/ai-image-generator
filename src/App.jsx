import { useState } from 'react';
import './App.css';
// resolution: 16*64=1024 - 9*64= 576, 16*80 =1280 - 9*80= 720, 16*90= 1440 - 9*90= 810, 1600x900, 16*120= 1920 - 9*120= 1080
// 1024x576, 1280x720, 1440x810, 1600x900, 1920x1080
const resolutionMap = {
  square: { label: 'Quadratisch (1:1)', width: 768, height: 768 },
  landscape: { label: 'Landscape (16:9)', width: 1024, height: 576 },
  portrait: { label: 'Portrait (9:16)', width: 576, height: 1024 },
};

function App() {
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState('landscape');
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setImageUrl(null); 

    const { width, height } = resolutionMap[ratio];
    // const qualityBoost = ", cinematic, highly detailed, 8k, photorealistic, sharp focus";
    const qualityBoost = ", 8k resolution, cinematic bokeh, f/1.8, 85 mm, highly detailed skin texture, nsfw, masterpiece, sharp focus, photorealistic, soft natural sunlight";
    const fullPrompt = encodeURIComponent(prompt + qualityBoost);
    const seed = Math.floor(Math.random() * 1000000);
    
    // const finalUrl = `https://pollinations.ai/p/${fullPrompt}?width=${width}&height=${height}&seed=${seed}&model=flux&nologo=true`;
    // const finalUrl = `https://pollinations.ai/p/${fullPrompt}?width=${width}&height=${height}&seed=${seed}&model=flux-realism&safe=false&nologo=true`;
    const finalUrl = `https://pollinations.ai/p/${fullPrompt}?width=${width}&height=${height}&seed=${seed}&model=turbo&private=true&enhance=true&safe=false&nologo=true`;
    setTimeout(() => {  
        setImageUrl(finalUrl);
    }, 50);
  };

  // Versucht den Download direkt zu triggern
  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.target = '_blank'; // Wichtig für Fallback
    link.download = `AI-Bild-${Date.now()}.jpg`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <h1>AI Image Creator</h1>
      
      <div className="controls-wrapper">
        <textarea
          className="prompt-input"
          placeholder="Beschreibe dein Bild (am besten auf Englisch)..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />

        <div className="settings-row">
          <div className="select-container">
            <label className="select-label">Bildformat</label>
            <select value={ratio} onChange={(e) => setRatio(e.target.value)} className="format-select">
              {Object.keys(resolutionMap).map((key) => (
                <option key={key} value={key}>
                  {resolutionMap[key].label}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            className="generate-btn-small" 
            onClick={handleGenerate} 
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? '...' : 'Erstellen'}
          </button>
        </div>
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Herunterladen / Vollbild
                </button>
                <p className="hint">Tipp: Falls der Download nicht startet, nutze Rechtsklick und dann "Speichern unter".</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;