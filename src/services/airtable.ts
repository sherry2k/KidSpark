// ============================================================
// AIRTABLE SERVICE - Fetch game content from Airtable
// ============================================================

// Configuration - Replace these with your Airtable credentials
const AIRTABLE_CONFIG = {
  API_KEY: import.meta.env.VITE_AIRTABLE_API_KEY || '',
  BASE_ID: import.meta.env.VITE_AIRTABLE_BASE_ID || '',
  
  // Table names in your Airtable base
  TABLES: {
    ANIMALS: 'Animals',
    FRUITS: 'Fruits',
    VEGETABLES: 'Vegetables',
    SHAPES: 'Shapes',
    COLORS: 'Colors',
    VEHICLES: 'Vehicles',
    BIRDS: 'Birds',
    BODY_PARTS: 'BodyParts',
    ALPHABET: 'Alphabet',
    NUMBERS: 'Numbers',
    QUIZ_QUESTIONS: 'QuizQuestions',
    WORD_BUILDER: 'WordBuilder',
  },
};

const API_URL = 'https://api.airtable.com/v0';

interface AirtableRecord<T> {
  id: string;
  fields: T;
  createdTime: string;
}

interface AirtableResponse<T> {
  records: AirtableRecord<T>[];
  offset?: string;
}

// Generic fetch function with pagination support
async function fetchAllRecords<T>(tableName: string): Promise<T[]> {
  if (!AIRTABLE_CONFIG.API_KEY || !AIRTABLE_CONFIG.BASE_ID) {
    console.warn('Airtable not configured, using local data');
    return [];
  }

  const allRecords: T[] = [];
  let offset: string | undefined;

  try {
    do {
      const url = new URL(`${API_URL}/${AIRTABLE_CONFIG.BASE_ID}/${encodeURIComponent(tableName)}`);
      url.searchParams.set('pageSize', '100');
      if (offset) {
        url.searchParams.set('offset', offset);
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_CONFIG.API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Airtable error: ${response.status} ${response.statusText}`);
      }

      const data: AirtableResponse<T> = await response.json();
      allRecords.push(...data.records.map(r => r.fields));
      offset = data.offset;
    } while (offset);

    return allRecords;
  } catch (error) {
    console.error(`Failed to fetch ${tableName} from Airtable:`, error);
    return [];
  }
}

// ============================================================
// TYPE DEFINITIONS FOR AIRTABLE RECORDS
// ============================================================

export interface AirtableLearnItem {
  id: string;
  name: string;
  emoji: string;
  funFact?: string;
  color?: string;
  category?: string;
}

export interface AirtableQuizQuestion {
  question: string;
  emoji: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctAnswer: number; // 1-4
  category: string;
}

export interface AirtableWordBuilderWord {
  word: string;
  emoji: string;
  hint: string;
}

// ============================================================
// FETCH FUNCTIONS FOR EACH CONTENT TYPE
// ============================================================

export async function fetchAnimals(): Promise<AirtableLearnItem[]> {
  return fetchAllRecords<AirtableLearnItem>(AIRTABLE_CONFIG.TABLES.ANIMALS);
}

export async function fetchFruits(): Promise<AirtableLearnItem[]> {
  return fetchAllRecords<AirtableLearnItem>(AIRTABLE_CONFIG.TABLES.FRUITS);
}

export async function fetchVegetables(): Promise<AirtableLearnItem[]> {
  return fetchAllRecords<AirtableLearnItem>(AIRTABLE_CONFIG.TABLES.VEGETABLES);
}

export async function fetchShapes(): Promise<AirtableLearnItem[]> {
  return fetchAllRecords<AirtableLearnItem>(AIRTABLE_CONFIG.TABLES.SHAPES);
}

export async function fetchColors(): Promise<AirtableLearnItem[]> {
  return fetchAllRecords<AirtableLearnItem>(AIRTABLE_CONFIG.TABLES.COLORS);
}

export async function fetchVehicles(): Promise<AirtableLearnItem[]> {
  return fetchAllRecords<AirtableLearnItem>(AIRTABLE_CONFIG.TABLES.VEHICLES);
}

export async function fetchBirds(): Promise<AirtableLearnItem[]> {
  return fetchAllRecords<AirtableLearnItem>(AIRTABLE_CONFIG.TABLES.BIRDS);
}

export async function fetchBodyParts(): Promise<AirtableLearnItem[]> {
  return fetchAllRecords<AirtableLearnItem>(AIRTABLE_CONFIG.TABLES.BODY_PARTS);
}

export async function fetchAlphabet(): Promise<AirtableLearnItem[]> {
  const records = await fetchAllRecords<AirtableLearnItem>(AIRTABLE_CONFIG.TABLES.ALPHABET);
  return records.sort((a, b) => a.id.localeCompare(b.id));
}

export async function fetchNumbers(): Promise<AirtableLearnItem[]> {
  const records = await fetchAllRecords<AirtableLearnItem>(AIRTABLE_CONFIG.TABLES.NUMBERS);
  return records.sort((a, b) => parseInt(a.name) - parseInt(b.name));
}

export async function fetchQuizQuestions(): Promise<AirtableQuizQuestion[]> {
  return fetchAllRecords<AirtableQuizQuestion>(AIRTABLE_CONFIG.TABLES.QUIZ_QUESTIONS);
}

export async function fetchWordBuilderWords(): Promise<AirtableWordBuilderWord[]> {
  return fetchAllRecords<AirtableWordBuilderWord>(AIRTABLE_CONFIG.TABLES.WORD_BUILDER);
}

// ============================================================
// MAIN FETCH ALL CONTENT FUNCTION
// ============================================================

export interface AirtableContent {
  animals: AirtableLearnItem[];
  fruits: AirtableLearnItem[];
  vegetables: AirtableLearnItem[];
  shapes: AirtableLearnItem[];
  colors: AirtableLearnItem[];
  vehicles: AirtableLearnItem[];
  birds: AirtableLearnItem[];
  bodyParts: AirtableLearnItem[];
  alphabet: AirtableLearnItem[];
  numbers: AirtableLearnItem[];
  quizQuestions: AirtableQuizQuestion[];
  wordBuilderWords: AirtableWordBuilderWord[];
}

export async function fetchAllContent(): Promise<AirtableContent | null> {
  if (!AIRTABLE_CONFIG.API_KEY || !AIRTABLE_CONFIG.BASE_ID) {
    console.log('Airtable not configured - using local fallback data');
    return null;
  }

  console.log('Fetching content from Airtable...');

  try {
    const [
      animals,
      fruits,
      vegetables,
      shapes,
      colors,
      vehicles,
      birds,
      bodyParts,
      alphabet,
      numbers,
      quizQuestions,
      wordBuilderWords,
    ] = await Promise.all([
      fetchAnimals(),
      fetchFruits(),
      fetchVegetables(),
      fetchShapes(),
      fetchColors(),
      fetchVehicles(),
      fetchBirds(),
      fetchBodyParts(),
      fetchAlphabet(),
      fetchNumbers(),
      fetchQuizQuestions(),
      fetchWordBuilderWords(),
    ]);

    console.log('Airtable content loaded successfully!');

    return {
      animals,
      fruits,
      vegetables,
      shapes,
      colors,
      vehicles,
      birds,
      bodyParts,
      alphabet,
      numbers,
      quizQuestions,
      wordBuilderWords,
    };
  } catch (error) {
    console.error('Failed to fetch content from Airtable:', error);
    return null;
  }
}

// ============================================================
// CHECK IF AIRTABLE IS CONFIGURED
// ============================================================

export function isAirtableConfigured(): boolean {
  return !!(AIRTABLE_CONFIG.API_KEY && AIRTABLE_CONFIG.BASE_ID);
}
