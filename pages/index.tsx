import React, { useState, useEffect, useRef } from "react";

import Header from "../components/Header";
import ResponsiveWordCloud from "../components/ResponsiveWordCloud";

import { initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";

import { extractColors } from "extract-colors";
const getPixels = require("get-pixels");

import { PixelsData } from "../interfaces/PixelsData";

const MemoizedResponsiveWordCloud = React.memo(ResponsiveWordCloud);

const Homepage = ({ playlistsData, hexColors }) => {
  const containerRef = useRef(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(0);
  const [colors, setColors] = useState(hexColors);
  const [donationDialogIsOpen, setDonationDialogIsOpen] = useState(true);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  const handleDonationDialogClose = () => {
    setDonationDialogIsOpen(false);
  };

  const handleNext = () => {
    if (playlistsData.length - 1 > selectedPlaylist) {
      setSelectedPlaylist(selectedPlaylist + 1);
    } else {
      setSelectedPlaylist(0);
    }
  };

  const handlePrev = () => {
    if (selectedPlaylist > 0) {
      setSelectedPlaylist(selectedPlaylist - 1);
    } else {
      setSelectedPlaylist(playlistsData.length - 1);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setContainerDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setColors(hexColors);
  }, [hexColors]);

  return (
    <div
      className={`flex flex-col items-center w-full h-full pb-5`}
      style={{
        backgroundColor: `${
          colors[playlistsData[selectedPlaylist].name].length > 0
            ? colors[playlistsData[selectedPlaylist].name][0]
            : "white"
        }`,
      }}
    >
      <Header
        playlistsData={playlistsData}
        selectedPlaylist={selectedPlaylist}
        colors={colors[playlistsData[selectedPlaylist].name]}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
      <div className="flex justify-center w-full h-full" ref={containerRef}>
        <MemoizedResponsiveWordCloud
          words={playlistsData[selectedPlaylist].wordsCount}
          colors={colors[playlistsData[selectedPlaylist].name].slice(1)}
          width={containerDimensions.width}
          height={containerDimensions.height}
        />
      </div>
    </div>
  );
};

const IndexPage = ({ playlistsData, hexColors }) => (
  <Homepage playlistsData={playlistsData} hexColors={hexColors} />
);

function getPixelsOn(url): Promise<PixelsData> {
  return new Promise((resolve) => {
    getPixels(url, (err, pixels) => {
      if (!err) {
        resolve(pixels);
      }
    });
  });
}

export async function getStaticProps() {
  const firebaseConfig = require("../firebase-config.json");

  const app = initializeApp(firebaseConfig);

  const firestore = getFirestore(app);
  const qSnap = await getDocs(
    query(collection(firestore, "playlists"), orderBy("name"))
  );

  const hexColors = {};

  const playlistsDocuments = qSnap.docs.map((doc) => doc.data());
  const playlistsData = await Promise.all(
    playlistsDocuments.map(async (playlist) => {
      const rawWordsCount = playlist["words_count"];

      const pixels = await getPixelsOn(playlist["coverURL"]);

      const data = [...pixels.data];
      const width = Math.round(Math.sqrt(data.length / 4));
      const height = width;

      const extractedColors = await extractColors(
        { data, width, height },
        {
          crossOrigin: "anonymous",
          distance: 0,
        }
      );
      extractedColors.sort((a, b) => b.area - a.area);

      hexColors[playlist.name] = extractedColors.map((color) => color.hex);

      return {
        name: playlist["name"],
        url: playlist["URL"],
        coverUrl: playlist["coverURL"],
        wordsCount: Object.keys(rawWordsCount).map((key) => ({
          text: key,
          value: rawWordsCount[key],
        })),
      };
    })
  );

  playlistsData.sort((a, b) => b.name - a.name);

  return {
    props: {
      playlistsData,
      hexColors,
    },
  };
}

export default IndexPage;
