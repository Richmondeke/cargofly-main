const fs = require('fs');
const content = fs.readFileSync('/tmp/stitch_variant_c.html', 'utf8');

// Use simple regex to extract the body content
let bodyMatches = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let bodyHtml = bodyMatches ? bodyMatches[1] : content;

// Remove <nav> and <footer>
bodyHtml = bodyHtml.replace(/<nav[\s\S]*?<\/nav>/i, '');
bodyHtml = bodyHtml.replace(/<footer[\s\S]*?<\/footer>/i, '');
bodyHtml = bodyHtml.replace(/<script[\s\S]*?<\/script>/i, '');

// Convert class to className
bodyHtml = bodyHtml.replace(/class=/g, 'className=');

// Fix closing tags for img and input
bodyHtml = bodyHtml.replace(/<img([^>]*[^\/])>/g, '<img$1 />');
bodyHtml = bodyHtml.replace(/<input([^>]*[^\/])>/g, '<input$1 />');

// Fix style attributes
bodyHtml = bodyHtml.replace(/style="([^"]*)"/g, (match, styleAttr) => {
    // Very rudimentary converter for this specific case (font-variation-settings)
    if (styleAttr.includes('font-variation-settings')) {
        return `style={{ fontVariationSettings: "'FILL' 1" }}`;
    }
    return match;
});

// React component template
const jsxContent = `
'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function LandingPageVariantC() {
  const [activeTab, setActiveTab] = useState<'track' | 'book'>('track');

  return (
    <div className="font-sans text-slate-900 bg-background-light dark:bg-background-dark dark:text-slate-100 transition-colors duration-200">
      ${bodyHtml}
    </div>
  );
}
`;

fs.writeFileSync('/tmp/page_c.tsx', jsxContent);
console.log('Done!');
