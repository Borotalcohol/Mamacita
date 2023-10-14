import PlaylistCard from "../components/PlaylistCard";

function Header({
  playlistsData,
  selectedPlaylist,
  colors,
  handlePrev,
  handleNext,
}) {
  return (
    <header
      className={`flex items-center justify-center w-full h-auto pt-4`}
      style={{
        background: `linear-gradient(90deg, ${
          colors.length > 0 ? colors[0] : "white"
        }, transparent)`,
      }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-[85%]">
        <h1 className="text-[35px] font-semibold text-white lg:text-[50px] font-pacifico stroke-black">
          🍑 Mamacita
        </h1>
        <PlaylistCard
          playlistInfo={playlistsData[selectedPlaylist]}
          handlePrev={handlePrev}
          handleNext={handleNext}
        />
      </div>
    </header>
  );
}

export default Header;
