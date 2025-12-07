"use client";

import { useState, useEffect } from "react";
import styles from "./Search.module.css";
import Main from "../Main/Main";
import '../../app/globals.css';


export default function Search({ showBackground = true }) {
  const [searchedCarModel, setSearchedCarModel] = useState("");
  const [message, setMessage] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Hide/show hero and info sections based on search results
  useEffect(() => {
    const heroSection = document.getElementById('hero-section');
    const infoSection = document.getElementById('info-section');
    const howItWorksSection = document.getElementById('how-it-works-section');
    
    if (heroSection && infoSection && howItWorksSection) {
      if (results.length > 0) {
        // Hide all sections
        heroSection.style.opacity = '0';
        heroSection.style.transform = 'translateY(-20px)';
        infoSection.style.opacity = '0';
        infoSection.style.transform = 'translateY(-20px)';
        howItWorksSection.style.opacity = '0';
        howItWorksSection.style.transform = 'translateY(-20px)';
        
        // Hide after transition
        setTimeout(() => {
          heroSection.style.display = 'none';
          infoSection.style.display = 'none';
          howItWorksSection.style.display = 'none';
        }, 300);
      } else {
        // Show all sections
        heroSection.style.display = 'block';
        infoSection.style.display = 'block';
        howItWorksSection.style.display = 'block';
        
        // Show with transition
        setTimeout(() => {
          heroSection.style.opacity = '1';
          heroSection.style.transform = 'translateY(0)';
          infoSection.style.opacity = '1';
          infoSection.style.transform = 'translateY(0)';
          howItWorksSection.style.opacity = '1';
          howItWorksSection.style.transform = 'translateY(0)';
        }, 10);
      }
    }
  }, [results]);

  async function handleSearchForm(e) {
    e.preventDefault();

    if (!searchedCarModel.trim()) {
      setMessage("Please enter a number plate.");
      setResults([]);
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // Call AWS Lambda API directly
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://warbs65b0l.execute-api.eu-central-1.amazonaws.com/Dev';
      const response = await fetch(`${apiUrl}?plate=${encodeURIComponent(searchedCarModel)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Parse the body if it's a string (Lambda returns stringified body)
      let carData = [];
      if (data.body) {
        carData = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
      } else if (Array.isArray(data)) {
        carData = data;
      }

      if (!carData || carData.length === 0) {
        setMessage("No car found with that number plate.");
        setResults([]);
      } else {
        setMessage("");
        setResults(carData);
      }
    } catch (error) {
      console.error('Search error:', error);
      setMessage("Error searching for cars. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className={showBackground ? styles.searchContainer : styles.searchContainerNoBg}>
        <div className={`container`}>
          <form className={styles.form} onSubmit={handleSearchForm}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Enter Number plate..."
            value={searchedCarModel}
            onChange={(e) => {
              const value = e.target.value;
              setSearchedCarModel(value);

              if (value.trim() === "") {
                setMessage("Please enter a number plate.");
              } else if (value.trim().length !== 7) {
                setMessage("Number plate must be exactly 7 characters.");
              } else {
                setMessage(""); // clear message when valid
              }
            }}
          />
          <button
            type="submit"
            className={styles.button}
            disabled={searchedCarModel.trim().length !== 7 || isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

          {message && <div className={styles.message}>{message}</div>}
          
          {results.length > 0 && (
            <button 
              type="button" 
              className={styles.clearButton}
              onClick={() => {
                setResults([]);
                setSearchedCarModel("");
                setMessage("");
              }}
            >
              ← Back to Home
            </button>
          )}
        </div>
      </div>

      {results.length > 0 && (
        <div className={styles.resultsSection}>
          <div className="container">
            <h2 className={styles.resultsTitle}>Search Results</h2>
          </div>
          {results.map((car, index) => (
            <div key={index}>
              <Main car={car} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
