"use client"
import React, { useState } from 'react';

const CharacterSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileChange = (e) => {
    setUploadedFile(e.target.files[0]); // Store the selected file in state
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!uploadedFile) {
      alert('Please select a file.');
      return;
    }

    console.log('Search Query:', searchQuery);
    console.log('Uploaded File:', uploadedFile);

    // Create a FormData object to send the file to a server
    const formData = new FormData();
    formData.append('uploadedFile', uploadedFile);
    formData.append('searchQuery', searchQuery);

    // Example: Send the form data to the server using fetch
    fetch('http://localhost:5001/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => console.log(response))
      .then((data) => {
        console.log('Response from server:', data);
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  };

  return (
    <form
      className="flex flex-col gap-4 border-2 border-[#AB6300] bg-[#3A73C4] font-bold text-black py-8 px-12 my-auto mr-auto min-h-[400]"
      onSubmit={handleSubmit}
    >
      <label htmlFor="characterSearch">
        Check for every POV and every mention of a character:
      </label>
      <input
        type="text"
        id="characterSearch"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Enter character name (leave blank for full character list)"
        aria-label="Character name search"
      />
      <input
        type="file"
        id="fileInput"
        name="uploadedFile"
        accept=".epub, .mobi, .txt, .pdf, .azw, .azw3, .doc, .rtf, .lit"
        required
        onChange={handleFileChange} // Track file selection
      />
      <button
        className="border transform duration-300 ease-in-out w-1/3 inline mt-4 mx-auto hover:bg-white hover:text-[#3A73C4] hover:border-[#AB6300]"
        type="submit"
      >
        Search
      </button>
    </form>
  );
};

export default CharacterSearch;
