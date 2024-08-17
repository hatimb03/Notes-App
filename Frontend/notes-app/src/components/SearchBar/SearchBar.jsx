/* eslint-disable react/prop-types */
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({
  value,
  onChange,
  handleSearch,
  onClearSearch,
  userInfo,
}) => {
  if (!userInfo) {
    return null;
  }

  return (
    <div className='w-80 flex items-center bg-slate-100 px-4 rounded-md'>
      <input
        type='text'
        value={value}
        placeholder='Search Notes ...'
        className='w-full bg-transparent text-xs py-[11px] outline-none'
        onChange={onChange}
      />

      {value && (
        <IoMdClose
          onClick={onClearSearch}
          className='text-slate-500 mr-3 cursor-pointer text-xl hover:text-black'
        />
      )}
      <FaMagnifyingGlass
        onClick={handleSearch}
        className='text-slate-400 cursor-pointer hover:text-black'
      />
    </div>
  );
};

export default SearchBar;
