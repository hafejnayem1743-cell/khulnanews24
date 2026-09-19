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
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';
    if (!slot?.adCode?.trim()) return;

    const isMobile = window.innerWidth < 768;
    const codeToInject = (isMobile && slot.mobileCode?.trim()) ? slot.mobileCode : slot.adCode;
    if (!codeToInject) return;

    // Adsterra's Native Banner code contains a fixed container id. The same
    // native unit should not be mounted twice in one document. If another
    // copy of this exact native container is already present, leave this slot
    // empty instead of creating duplicate ids or double-loading the unit.
    const nativeContainerMatch = codeToInject.match(/id=["'](container-[^"']+)["']/i);
    if (nativeContainerMatch && document.querySelector(`#${CSS.escape(nativeContainerMatch[1])}`)) {
      return;
    }

    const temp = document.createElement('div');
    temp.innerHTML = codeToInject;
    const scripts = Array.from(temp.querySelectorAll('script'));

    Array.from(temp.childNodes).forEach(node => {
      if (node.nodeName !== 'SCRIPT') container.appendChild(node);
    });

    scripts.forEach(oldScript => {
      const script = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => script.setAttribute(attr.name, attr.value));
      script.text = oldScript.textContent || '';
      container.appendChild(script);
    });

    return () => {
      container.innerHTML = '';
    };
  }, [slot?.id, slot?.adCode, slot?.mobileCode, slot?.isActive]);

  if (!slot) return null;

  const isOverlay = position === 'SOCIAL_BAR' || position === 'POPUNDER';

  return (
    <div
      id={`ad-slot-${position.toLowerCase().replace(/_/g, '-')}`}
      className={`${isOverlay ? 'ad-overlay-slot' : 'ad-slot my-3 flex justify-center items-center overflow-hidden transition-all'} ${className}`}
      aria-label={isOverlay ? undefined : 'Advertisement'}
    >
      <div ref={containerRef} className={isOverlay ? '' : 'w-full flex justify-center'} />
    </div>
  );
};
