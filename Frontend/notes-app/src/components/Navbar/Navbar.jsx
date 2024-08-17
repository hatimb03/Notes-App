import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
export const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };
  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  return (
    <>
      <div className='bg-white flex flex-wrap gap-4 sm:gap-0 items-center justify-center sm:justify-between px-6 py-2 drop-shadow'>
        <h2 className='md:text-xl md:font-medium md:py-2'>Notes</h2>
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
          userInfo={userInfo}
        />
        <ProfileInfo userInfo={userInfo} onLogout={handleLogout} />
      </div>
    </>
  );
};
