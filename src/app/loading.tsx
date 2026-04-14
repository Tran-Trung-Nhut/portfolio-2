import Image from 'next/image';
import logoSvg from '@/assets/logo.svg';
import logoAltPng from '@/assets/logo.alt.png';

export default function Loading() {
  return (
    <div className="loading-overlay">
      <div className="loader-container">
        <div className="loader-orbit loader-orbit-1"></div>
        <div className="loader-orbit loader-orbit-2"></div>
        <div className="loader-logo">
          <Image 
            src={logoSvg} 
            alt="Loading logo" 
            priority
            className="loader-logo-img loader-logo-svg"
          />
          <Image 
            src={logoAltPng} 
            alt="Loading logo alt" 
            priority
            className="loader-logo-img loader-logo-alt"
          />
        </div>
      </div>
      <p className="loading-text">
        LOADING...
      </p>
    </div>
  );
}
