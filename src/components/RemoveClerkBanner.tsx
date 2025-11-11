"use client";

import { useEffect } from "react";

export function RemoveClerkBanner() {
  useEffect(() => {
    // Remove Clerk keyless mode banner and popup
    const removeBanner = () => {
      // More comprehensive selectors for Clerk banners and popups
      const selectors = [
        '[data-clerk-keyless-mode-banner]',
        '[data-clerk-keyless]',
        '.cl-keyless-mode-banner',
        '.cl-keyless-banner',
        'div[class*="keyless"]',
        'div[class*="Keyless"]',
        '[class*="clerk-banner"]',
        '[id*="clerk-banner"]',
        '[class*="clerk"] [class*="banner"]',
        'div[class*="Clerk"]',
        '[role="dialog"]', // Popups are often dialogs
        '[class*="popup"]',
        '[class*="modal"]',
        '[class*="overlay"]',
      ];
      
      // Also check all divs for Clerk-related content
      const allDivs = document.querySelectorAll('div');
      
      allDivs.forEach((el) => {
        try {
          const text = el.textContent?.toLowerCase() || '';
          const className = el.className?.toLowerCase() || '';
          const id = el.id?.toLowerCase() || '';
          
          // Check for keyless mode indicators
          if (
            text.includes('keyless mode') ||
            text.includes('claim application') ||
            text.includes('link this application') ||
            text.includes('you\'ve created your first user') ||
            className.includes('keyless') ||
            className.includes('clerk-banner') ||
            id.includes('clerk') ||
            id.includes('keyless')
          ) {
            // Hide and remove the element
            (el as HTMLElement).style.display = 'none';
            (el as HTMLElement).style.visibility = 'hidden';
            (el as HTMLElement).style.opacity = '0';
            (el as HTMLElement).style.pointerEvents = 'none';
            el.remove();
          }
        } catch (e) {
          // Ignore errors
        }
      });
      
      // Also try the specific selectors
      selectors.forEach((selector) => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => {
            const text = el.textContent?.toLowerCase() || '';
            if (text.includes('keyless') || text.includes('claim') || text.includes('link this application')) {
              (el as HTMLElement).style.display = 'none';
              (el as HTMLElement).style.visibility = 'hidden';
              (el as HTMLElement).remove();
            }
          });
        } catch (e) {
          // Ignore errors
        }
      });
    };

    // Run immediately
    removeBanner();

    // Watch for dynamically added elements
    const observer = new MutationObserver(() => {
      removeBanner();
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id', 'data-clerk'],
    });

    // Also run on interval as fallback (more frequent)
    const interval = setInterval(removeBanner, 100);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return null;
}



