import fs from 'fs';
import path from 'path';

type Pet = {
  name: string;
  size: string;
  personality: string;
  animalType: string;
  imageUrl: string;
};

// ✅ Get the correct path for both development and production
function getDataPath() {
  const envPath = process.env.PETS_JSON_PATH;
  const fullPath = envPath
    ? path.resolve(envPath)
    : path.join(process.cwd(), 'data', 'pets.json');

  console.log('🔍 Final pets.json path being used:', fullPath);
  return fullPath;
}

const filePath = getDataPath();

function ensureDataDirectoryExists() {
  const dataDir = path.dirname(filePath);
  console.log('📁 Ensuring directory exists:', dataDir);
  if (!fs.existsSync(dataDir)) {
    console.log('📁 Creating directory:', dataDir);
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export function loadPets(): Pet[] {
  try {
    ensureDataDirectoryExists();
    console.log('📁 Loading pets from:', filePath);
    if (!fs.existsSync(filePath)) {
      console.warn('⚠️ pets.json does not exist. Returning empty list.');
      return [];
    }

    const raw = fs.readFileSync(filePath, 'utf-8').trim();
    if (!raw) {
      console.warn('⚠️ pets.json is empty. Returning empty list.');
      return [];
    }

    const pets = JSON.parse(raw);
    console.log('📁 Loaded pets:', pets);
    return pets;
  } catch (err) {
    console.error('❌ Failed to read or parse pets.json:', err);
    return [];
  }
}

export function removePetByName(name: string) {
  console.log('📁 Removing pet:', name);
  ensureDataDirectoryExists();
  const pets = loadPets();
  const updated = pets.filter((p: Pet) => p.name.toLowerCase() !== name.toLowerCase());
  console.log('📁 Writing updated pets:', updated);
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf-8');
}

export function savePet(pet: {
  name: string;
  size: string;
  personality: string;
  animalType: string;
  imageUrl?: string;
}) {
  try {
    console.log('💾 savePet() called with:', pet);
    ensureDataDirectoryExists();
    const pets = loadPets();
    pets.push({
      name: pet.name,
      size: pet.size,
      personality: pet.personality,
      animalType: pet.animalType,
      imageUrl: pet.imageUrl || '',
    });
    fs.writeFileSync(filePath, JSON.stringify(pets, null, 2), 'utf-8');
    console.log('✅ Pet saved successfully to:', filePath);
  } catch (err) {
    console.error('❌ Failed to write pets.json:', err);
  }
}

export async function fetchStatus() {
  return { status: 'ok', timestamp: new Date().toISOString() };
}



// For compatibility
export { loadPets as getAllPets };
