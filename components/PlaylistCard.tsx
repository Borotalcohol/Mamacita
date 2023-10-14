import { Suspense } from "react";

import {
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

import LazyImage from "../components/LazyImage";

function PlaylistCard({ playlistInfo, handlePrev, handleNext }) {
  return (
    <div className="flex items-center justify-start gap-3 px-2 py-4 mt-4 bg-opacity-50 border border-gray-300 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-lg md:mt-0 md:gap-5 bg-black/30">
      <button onClick={handlePrev}>
        <ChevronLeftIcon className="w-6 h-6 text-white/60 hover:text-white/80" />
      </button>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyImage
          src={playlistInfo.coverUrl}
          alt="Playlist Cover"
          className="w-[45px] md:w-[60px] rounded-sm border border-gray-300"
        />
      </Suspense>
      <div className="flex flex-col items-start justify-center h-full">
        <h2 className="text-lg font-semibold text-white md:text-xl">
          {playlistInfo.name}
        </h2>
        <div className="flex items-center gap-1">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"
            alt="Spotify Logo"
            className="w-4 h-4"
          />
          <a
            href={playlistInfo.url}
            className="text-sm text-white md:text-md"
            target="_blank"
          >
            Listen on Spotify
          </a>
          <ArrowTopRightOnSquareIcon className="w-4 h-4 text-white" />
        </div>
      </div>
      <button onClick={handleNext}>
        <ChevronRightIcon className="w-6 h-6 text-white/60 hover:text-white/80" />
      </button>
    </div>
  );
}

export default PlaylistCard;
