'use client';
import React from 'react';

// Define the structure of a single search match object based on documentation
// interface Match {
//   pageIndex: number;
//   pageText: string;
//   startIndex: number;
//   endIndex: number;
// }

// Props:
// - matches: Match[]
// - onSelectMatch: (matchNumber: number) => void (matchNumber is 1-based)
// - currentMatchIndex: number (1-based, optional, for highlighting the active match in the list)

const PdfSearchResultsPane = ({ matches, onSelectMatch, currentMatchIndex }) => {
  if (!matches || matches.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        No matches found, or search not yet performed.
      </div>
    );
  }

  const extractSnippet = (match) => {
    const keyword = match.pageText.substring(match.startIndex, match.endIndex);
    // Get up to 20 chars before, ensuring we don't break words badly if possible (simple substring for now)
    const beforeText = match.pageText.substring(Math.max(0, match.startIndex - 30), match.startIndex);
    // Get up to 60 chars after
    const afterText = match.pageText.substring(match.endIndex, Math.min(match.pageText.length, match.endIndex + 70));
    
    // Attempt to not start/end mid-word for 'before' and 'after' context
    const smartBefore = beforeText.length > 0 && beforeText.includes(' ') ? '...' + beforeText.substring(beforeText.indexOf(' ') + 1) : beforeText;
    const smartAfter = afterText.length > 0 && afterText.lastIndexOf(' ') !== -1 ? afterText.substring(0, afterText.lastIndexOf(' ')) + '...' : afterText;

    return (
      <>
        {smartBefore}
        <mark className="bg-yellow-300 text-black">{keyword}</mark>
        {smartAfter}
      </>
    );
  };

  return (
    <div className="border rounded-lg bg-card text-card-foreground shadow-sm max-h-96 overflow-y-auto">
      <ul className="divide-y divide-border">
        {matches.map((match, index) => {
          const matchNumber = index + 1;
          const isActive = matchNumber === currentMatchIndex;
          return (
            <li key={index}>
              <button
                type="button"
                onClick={() => onSelectMatch(matchNumber)}
                className={`w-full text-left p-3 hover:bg-muted/50 focus:outline-none focus:bg-muted/50 transition-colors ${isActive ? 'bg-muted' : ''}`}
                aria-current={isActive ? 'true' : undefined}
              >
                <div className="font-semibold text-sm">
                  Match {matchNumber} on Page {match.pageIndex + 1}
                </div>
                <p className="text-xs text-muted-foreground truncate_"> 
                  {/* The 'truncate' class from tailwind might be useful if snippets are long */}
                  {extractSnippet(match)}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PdfSearchResultsPane;
