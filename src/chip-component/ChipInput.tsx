import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import './ChipInput.css';

interface Chip {
  id: string;
  label: string;
}

const ChipInput: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [chips, setChips] = useState<Chip[]>([]);
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const [highlightedChipIndex, setHighlightedChipIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: string[] = [
    "Nick Giannopoulos", "John Doe", "Jane Smith", "Alice Johnson",
    "Bob Anderson", "Eva Martinez", "Chris Williams", "Sophie Brown"
  ];

  useEffect(() => {
    setFilteredItems(
      items.filter(
        item =>
          !chips.find(chip => chip.label === item) &&
          item.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  }, [chips, items, inputValue]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setHighlightedChipIndex(null);
  };

  const handleItemClick = (item: string) => {
    setChips([...chips, { id: item, label: item }]);
    setInputValue('');
    setHighlightedChipIndex(null);
  };

  const handleChipRemove = (id: string) => {
    setChips(chips.filter(chip => chip.id !== id));
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && inputValue === '' && chips.length > 0) {
      if (highlightedChipIndex === null) {
        // Highlight the last chip
        setHighlightedChipIndex(chips.length - 1);
      } else {
        // Remove the highlighted chip
        handleChipRemove(chips[highlightedChipIndex].id);
        setHighlightedChipIndex(null);
      }
    }
  };

  const highlightMatch = (item: string): React.ReactNode => {
    const index = item.toLowerCase().indexOf(inputValue.toLowerCase());
    if (index !== -1) {
      return (
        <>
          {item.substring(0, index)}
          <span className="highlight">{item.substring(index, index + inputValue.length)}</span>
          {item.substring(index + inputValue.length)}
        </>
      );
    }
    return item;
  };

  return (
    <div className="chip-input-container">
      <div className="search-bar">
        <input
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Type to search..."
        />
        <div className="chips-list">
          {chips.map((chip, index) => (
            <div
              key={chip.id}
              className={`chip ${index === highlightedChipIndex ? 'highlighted' : ''}`}
            >
              {chip.label}
              <span className="remove-icon" onClick={() => handleChipRemove(chip.id)}>
                X
              </span>
            </div>
          ))}
        </div>
      </div>
      {inputValue && (
        <div className="suggestion-list">
          {filteredItems.map(item => (
            <div key={item} className="suggestion" onClick={() => handleItemClick(item)}>
              {highlightMatch(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChipInput;
