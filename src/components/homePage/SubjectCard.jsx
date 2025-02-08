'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const SubjectCard = ({ topic, onClick, recentlyViewed }) => (
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
        {recentlyViewed.some(recent => recent.file === topic.file) && (
          <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-xs">
            Recently Viewed
          </div>
        )}
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

export default SubjectCard;
