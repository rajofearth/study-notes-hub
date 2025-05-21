'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const SubjectCard = ({ topic, onClick, recentlyViewed, isPinned, onPinClick }) => {
  const handlePinClick = (event) => {
    event.stopPropagation(); // Prevent card navigation
    if (onPinClick) {
      onPinClick(topic);
    }
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 subject-card"
      onClick={() => onClick(topic)}
      role="button"
      aria-label={`View ${topic.title} notes`}
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick(topic)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-video">
          <img
            alt={topic.title}
            className="object-cover w-full h-full"
            src={topic.image}
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <h3 className="text-xl font-semibold text-white">{topic.title}</h3>
          </div>

          {/* Pin Button */}
          {onPinClick && (
            <button
              onClick={handlePinClick}
              className="absolute top-2 left-2 z-10 p-2 rounded-full bg-transparent text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={isPinned ? `Unpin ${topic.title}` : `Pin ${topic.title}`}
              title={isPinned ? `Unpin ${topic.title}` : `Pin ${topic.title}`}
            >
              {isPinned ? (
                <span className="text-2xl" role="img" aria-label="Pinned">★</span> {/* Filled star */}
              ) : (
                <span className="text-2xl" role="img" aria-label="Not Pinned">☆</span> {/* Outline star */}
              )}
            </button>
          )}

          {/* Recently Viewed Badge */}
          {recentlyViewed && recentlyViewed.some(recent => recent.file === topic.file) && (
            <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-xs">
              Recently Viewed
            </div>
          )}

          {/* Progress Indicators */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/80">
            <div className="flex gap-2 justify-center">
              <span
                className={`h-2 w-2 rounded-full ${topic.progress?.notes ? 'bg-green-500' : 'bg-gray-500'}`}
                title="Notes Progress"
              />
              <span
                className={`h-2 w-2 rounded-full ${topic.progress?.handwritten ? 'bg-green-500' : 'bg-gray-500'}`}
                title="Handwritten Notes Progress"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectCard;
