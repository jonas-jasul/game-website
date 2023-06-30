const categoryLookupTable = {
    "main game": 0,
    'dlc / add-on': 1,
    'expansion': 2,
    'bundle': 3,
    'standalone expansion': 4,
    'mod': 5,
    'episode': 6,
    'season': 7,
    'remake': 8,
    'remaster': 9,
    'expanded game': 10,
    'port': 11,
    'fork': 12,
    'pack': 13,
    'update': 14,
  };


 export const categoryMapper = (category) => categoryLookupTable[category];