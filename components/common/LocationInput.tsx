"use client";
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import _ from 'lodash';

interface LocationInputProps {
  label: string;
  onLocationSelect: (lat: number, lng: number) => void;
}

interface NominatimSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    road?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

const LocationInput: React.FC<LocationInputProps> = ({ label, onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<NominatimSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/map?query=${searchQuery}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSuggestions(data || []);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetch = useCallback(_.debounce(fetchSuggestions, 300), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFetch(value);
  };

  const handleSuggestionClick = (suggestion: NominatimSuggestion) => {
    setQuery(suggestion.display_name);
    setSuggestions([]);
    onLocationSelect(parseFloat(suggestion.lat), parseFloat(suggestion.lon));
  };

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <Input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full"
      />
      {isLoading && <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1">Loading...</div>}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <li
              key={item.place_id}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSuggestionClick(item)}
            >
              <div className="font-semibold">{item.display_name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationInput;
