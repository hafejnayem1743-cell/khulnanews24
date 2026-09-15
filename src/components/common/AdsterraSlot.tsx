import React, { useEffect, useRef } from 'react';
import { useNews } from '../../context/NewsContext';
import { AdPosition } from '../../types';

interface AdsterraSlotProps {
  position: AdPosition;
  className?: string;
}

export const AdsterraSlot: React.FC<AdsterraSlotProps> = ({ position, className = '' }) => {
  const { adSlots } = useNews();
  const containerRef = useRef<HTMLDivElement>(null);

  const slot = adSlots.find(s => s.position === position && s.isActive);

  useEffect(() => {
    if (!slot || !containerRef.current) return;
    
    // Choose desktop code or mobile code if screen is small
    const isMobile = window.innerWidth < 768;
    const codeToInject = (isMobile && slot.mobileCode) ? slot.mobileCode : slot.adCode;

    if (!codeToInject) return;

    // Clean previous content
    containerRef.current.innerHTML = '';

    // Create a shadow container or direct DOM parsing for scripts
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = codeToInject;

    // Execute scripts if any exist in the adCode
    const scripts = tempDiv.getElementsByTagName('script');
    const scriptsArray = Array.from(scripts);

    // Append non-script elements
    while (tempDiv.firstChild) {
      if (tempDiv.firstChild.nodeName !== 'SCRIPT') {
        containerRef.current.appendChild(tempDiv.firstChild);
      } else {
        tempDiv.removeChild(tempDiv.firstChild);
      }
    }

    // Safely re-create and execute script tags
    scriptsArray.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      containerRef.current?.appendChild(newScript);
    });
  }, [slot]);

  if (!slot) return null;

  return (
    <div 
      id={`ad-slot-${position.toLowerCase().replace(/_/g, '-')}`} 
      className={`ad-slot my-3 flex justify-center items-center overflow-hidden transition-all ${className}`}
    >
      <div ref={containerRef} className="w-full flex justify-center" />
    </div>
  );
};
