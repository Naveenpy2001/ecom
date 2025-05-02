import React, { useState, useEffect } from 'react';
import axios from 'axios';

import '../css/style.css'


function Ghibli() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformedImage, setTransformedImage] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const transformImage = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }
    
    setIsTransforming(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('style', 'ghibli');
      
      const response = await axios.post('http://127.0.0.1:8000/api/transform/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setTransformedImage(response.data.transformed_image_url);
      setHistory(prev => [response.data, ...prev]);
    } catch (err) {
      setError('Failed to transform image. Please try again.');
      console.error(err);
    } finally {
      setIsTransforming(false);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/transformations/');
      setHistory(response.data);
    } catch (err) {
      console.error('Failed to load history', err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="app-container">
      <div className="header">
        <h1>Ghibli Style Transformer</h1>
        <p>Upload an image to transform it into a Studio Ghibli-style artwork</p>
      </div>
      
      <div className="generator-section">
        <div className="upload-container">
          <div className="file-upload">
            <label htmlFor="image-upload" className="upload-label">
              {preview ? (
                <img src={preview} alt="Preview" className="preview-image" />
              ) : (
                <div className="upload-placeholder">
                  <span>+</span>
                  <p>Click to upload an image</p>
                </div>
              )}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>
          
          <button
            className="transform-button"
            onClick={transformImage}
            disabled={isTransforming || !selectedFile}
          >
            {isTransforming ? 'Transforming...' : 'Transform to Ghibli Style'}
            {isTransforming && <div className="spinner"></div>}
          </button>
          
          {error && <p className="error-message">{error}</p>}
        </div>
        
        {transformedImage && (
          <div className="result-container">
            <h2>Your Ghibli-Style Image</h2>
            <div className="image-comparison">
              <div className="comparison-image">
                <h3>Original</h3>
                <img src={preview} alt="Original" />
              </div>
              <div className="comparison-image">
                <h3>Ghibli Style</h3>
                <img src={transformedImage} alt="Ghibli Style" />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="history-section">
        <h2>Transformation History</h2>
        <div className="history-grid">
          {history.map((item) => (
            <div className="history-card" key={item.id}>
              <div className="history-image-container">
                <img src={item.original_image_url} alt="Original" />
                <img src={item.transformed_image_url} alt="Ghibli Style" />
              </div>
              <p>Transformed on {new Date(item.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Ghibli;