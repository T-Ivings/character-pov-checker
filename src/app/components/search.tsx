"use client"
import React, { useState } from 'react';

const CharacterSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle the form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();  // Prevent the form from refreshing the page
    if (searchQuery.trim()) {
      // Call your API or perform the search here
      console.log(`Searching for character: ${searchQuery}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="characterSearch">Check for every POV and every mention of a character:</label>
      <input
        type="text"
        id="characterSearch"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update state as user types
        placeholder="Enter character name"
        aria-label="Character name search"
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default CharacterSearch;
