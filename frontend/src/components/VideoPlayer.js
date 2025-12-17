'use client';

import React from 'react';
import { Play, Pause, Volume2, Maximize, Settings, SkipForward, SkipBack } from 'lucide-react';

export default function VideoPlayer({ title, videoId = "76979871" }) {
    // Using a default Vimeo ID if none provided, or simple prop
    return (
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group shadow-xl">
            <iframe
                src={`https://player.vimeo.com/video/${videoId}?h=0&title=0&byline=0&portrait=0`}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={title}
            ></iframe>
        </div>
    );
}
