import React, { useState, useEffect } from "react";
import { useMusic } from "../context/MusicContext";
import AddToPlaylistMenu from "../components/AddToPlaylistMenu";

const ExploreView = () => {
  const { playTrack, currentTrack, isPlaying, togglePlay } = useMusic();

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");

  useEffect(() => {
    const fetchExploreTracks = async () => {
      try {
        setLoading(true);
        // Fetch a larger limit (e.g., 100 songs) directly from both endpoints
        const [publicRes, catalogRes] = await Promise.all([
          fetch('http://localhost:3000/api/creatorupload/public?limit=100'),
          fetch('http://localhost:3000/api/music?limit=100')
        ]);

        const publicData = await publicRes.json();
        const catalogData = await catalogRes.json();

        const newPublic = Array.isArray(publicData) ? publicData : (publicData.uploads || []);
        const newCatalog = Array.isArray(catalogData) ? catalogData : (catalogData.songs || []);
        
        // Combine and deduplicate by _id
        const combined = [...newPublic, ...newCatalog];
        const uniqueTracks = Array.from(new Map(combined.map(t => [t._id, t])).values());

        setTracks(uniqueTracks);
      } catch (err) {
        console.error("Error fetching explore tracks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExploreTracks();
  }, []);

  // Client-side filtering based on tabs
  const filteredTracks = tracks.filter((item) => {
    if (selectedFilter === "Community") return Boolean(item.uploaderId || item.uploaderName);
    if (selectedFilter === "Catalog") return !item.uploaderId && !item.uploaderName;
    return true;
  });

  const renderCover = (item) => {
    const imageUrl = item.coverUrl || item.cover || item.albumArt || item.img;
    const isUrl =
      imageUrl &&
      typeof imageUrl === "string" &&
      (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"));

    return (
      <div className="w-full h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden flex items-center justify-center relative shadow-md">
        {isUrl ? (
          <img
            src={imageUrl}
            alt={item.title || "Cover"}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl">
            {typeof item.cover === "string" && !item.cover.startsWith("http")
              ? item.cover
              : "🎵"}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#12141c] rounded-2xl p-6 overflow-y-auto flex flex-col gap-6 min-w-0 w-full h-full">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Explore Community & Catalog
        </h1>
        <p className="text-sm text-gray-400">
          Discover new tracks uploaded by creators and featured artists worldwide.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3">
        {["All", "Community", "Catalog"].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedFilter === filter
                ? "bg-[#00f2fe] text-black shadow-[0_0_15px_rgba(0,242,254,0.3)]"
                : "bg-[#161922] text-gray-400 border border-gray-800 hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Tracks Grid */}
      {loading ? (
        <div className="text-gray-400 text-sm py-10 text-center">
          Loading explore tracks...
        </div>
      ) : filteredTracks.length === 0 ? (
        <div className="text-gray-500 text-sm py-12 text-center bg-[#161922]/40 rounded-2xl border border-gray-800/50">
          No tracks found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-6">
          {filteredTracks.map((item, index) => {
            const isCurrent =
              (currentTrack?._id && currentTrack._id === item._id) ||
              (currentTrack?.audioUrl && currentTrack.audioUrl === item.audioUrl);

            return (
              <div
                key={item._id || index}
                onClick={() =>
                  isCurrent ? togglePlay() : playTrack(item, filteredTracks)
                }
                className={`bg-[#161922] p-4 rounded-2xl flex flex-col gap-3 group hover:bg-[#1c202d] transition-all duration-300 cursor-pointer border ${
                  isCurrent
                    ? "border-[#00f2fe] bg-[#1c2233]"
                    : "border-gray-800/40 hover:border-gray-700"
                }`}
              >
                {renderCover(item)}
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate">
                    <h3
                      className={`text-sm font-semibold truncate ${
                        isCurrent ? "text-[#00f2fe]" : "text-white"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {item.uploaderName
                        ? `By ${item.uploaderName}`
                        : item.artist}
                    </p>
                  </div>
                  <AddToPlaylistMenu track={item} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

ExploreView.displayName = "ExploreView";

ExploreView.displayName = "ExploreView";

export default ExploreView;