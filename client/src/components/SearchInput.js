import { FaSearch } from "react-icons/fa";

const SearchInput = () => {
  return (
    <div className="search-container">
      <FaSearch className="search-icon" />
      <input type="text" className="search-input" placeholder="Search..." />
    </div>
  );
};

export default SearchInput;
