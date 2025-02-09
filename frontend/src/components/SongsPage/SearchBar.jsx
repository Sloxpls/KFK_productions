import { useState, } from 'react'
import './SearchBar.css'

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search...",
  initialValue = "",
  className = "search-bar"
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue)

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  const handleClear = () => {
    setSearchTerm("")
    onSearch("")
  }

  return (
    <>
    <input
      type="text"
      placeholder={placeholder}
      value={searchTerm}
      onChange={handleSearch}
      className={className}
    />

    <button id="clear-button"
      onClick={handleClear}>
      Clear
    </button>
    </>
  )
}

export default SearchBar