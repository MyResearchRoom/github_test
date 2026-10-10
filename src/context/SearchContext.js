import { createContext, useContext, useEffect, useState } from "react";

const SearchContext=createContext();

// Create a custom hook to use the context
export const useSearch = () => {
  return useContext(SearchContext);
};

// Create the provider component
export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debounceSearchTerm,setDebounceSearchTerm]=useState('');

    // Debounce logic (500ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);


  return (
    <SearchContext.Provider value={{ searchTerm,setSearchTerm,debounceSearchTerm}}>
      {children}
    </SearchContext.Provider>
  );
};
