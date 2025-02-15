import React, { useEffect } from 'react'
import './styles/LoadingScreen.css'

export function LoadingScreen() {
  useEffect(() => {
    const firstSvg = document.querySelector('.svg-elem-1');
    const secondSvg = document.querySelector('.svg-elem-2');
    const dotSvg = document.querySelector('.hidden.circle');
    const loadingScreen = document.querySelector('.loadingScreen');

    if (firstSvg && secondSvg && dotSvg && loadingScreen) {
      firstSvg.classList.remove('hidden');
      firstSvg.classList.add('animate');

      setTimeout(() => {
        dotSvg.classList.remove('hidden');
        dotSvg.classList.add('fade-in');
      }, 4000);

      firstSvg.addEventListener('animationend', function() {
        setTimeout(() => {
          secondSvg.classList.add('animate');
          document.querySelector('.hidden.spacing').classList.remove('hidden');
          setTimeout(() => {
            document.querySelector('.fade').classList.add('fade-out');
          }, 2500);
        }, 800);
      });

      setTimeout(() => {
        loadingScreen.classList.add('fade-out');
      }, 10000);
    }
  }, []);

  return (
    <div className="loadingScreen">
      <div className="container">
        <div className="fade"></div>
        <div className="svg-container">
          <svg className="hidden circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50">
            <circle cx="50" cy="50" r="2" stroke="white" strokeWidth="10" fill="none" />
          </svg>
          <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 406.29 181.42" width="203.145" height="90.71">
            <defs>
              <style>{`.cls-1{fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:9px;}`}</style>
            </defs>
            <path className="hidden cls-1 svg-elem-1" d="M36.82,362.24S51,335.85,64.34,344.05a2,2,0,0,1,.82,1c.61,1.71,1.34,6.79-3.55,18.92,0,0,0,.07,0,.11-.73,2.24-24.28,74.73-8.81,78.86,15.71,4.2,30-9.18,30-9.18s27.46-20.52,42.06-95.32L83.14,499.77a1.77,1.77,0,0,1-.18.45c-.93,1.72-7.58,12.84-21.32,10.28-14.89-2.78-6.06-21-6.06-21s6.08-15.08,32-28.43,53.38-39,57.28-65.7c0,0-18.65,50.48-6.07,51.56S167.85,435.54,184,393c0,0-18.89,52.69-6.38,52.67s19.67-15.54,19.67-15.54l18.23-34.36a2,2,0,0,1,3.79.86c.15,4-.51,10.56-3.66,20.73-6.46,20.88,2.56,24,2.56,24s23.25,8.85,35.47-32.44a2.36,2.36,0,0,0,.09-.52l.53-17a2,2,0,0,0-3.34-1.56c-.93,1-.39,3,5.45,6.7a2.11,2.11,0,0,1,.5.44c1.24,1.58,8.24,10,16.28,10.52,8.86.57,20.22-18.52,20.89-25.55s-7.94-3.57-7.28,1.18c.51,3.69,5,6,7,6.88a2,2,0,0,0,1.72,0c4.79-2.47,29.35-14.16,20.34,10-8.11,21.79-6.86,32.16-6.12,35.25a2,2,0,0,0,1.37,1.43c3.71,1.08,16.84,2.06,33.7-29.23,20-37.13,43-25.47,43-25.47s-34.73-11.5-43.85,34.8a2.28,2.28,0,0,0,0,.45c.07,3.19,1.5,38.84,31.93-1.19a1,1,0,0,1,.13-.16,80,80,0,0,0,18-35.56s-19.91,53.56-7.5,52.51,22.39-17.39,22.39-17.39,8.25-13.15,14.74-23.94a2,2,0,0,1,3.66,1.56l-19.7,74.41S402,494,387.61,491.39s-4.55-21.28-4.55-21.28,7.74-19.17,51.05-44.06" transform="translate(-32.32 -333.96)"></path>
          </svg>
          <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 93.99 123.18" width="46.995" height="61.59" className="hidden spacing svg-elem-2">
            <path className="cls-1 svg-elem-2" d="M490.19,352.41s26.09-15.39,33.59-32.29L495,432s14.63-97.84,58-113.69c0,0,25.78-6,21.69,23.37,0,0,1,30.78-50.53,43.6" transform="translate(-485.69 -313.34)"></path>
          </svg>
        </div>
      </div>
    </div>
  )
}