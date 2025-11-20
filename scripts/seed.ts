import { MongoClient } from 'mongodb';
import type { Question } from '../src/lib/types/question';

const uri =
	process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/pokelandar?authSource=admin';
const dbName = process.env.MONGODB_DB_NAME || 'pokelandar';

type SeedQuestion = Omit<Question, '_id'> & { _id: string };

const sampleQuestions: SeedQuestion[] = [
	// Tag 1: Starter-Pokémon
	{
		_id: 'starter-bisasam',
		question: 'Wie heißt das Pflanzen-Pokémon, das Professor Eich einem Trainer am Anfang schenkt?',
		answer: 'Bisasam',
		reward: 'Richtig! Bisasam ist der Pflanzen-Starter!',
		day: 1,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'starter-glumanda',
		question: 'Wie heißt das Feuer-Pokémon, das Professor Eich einem Trainer am Anfang schenkt?',
		answer: 'Glumanda',
		reward: 'Korrekt! Glumanda ist der Feuer-Starter!',
		day: 1,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'starter-schiggy',
		question: 'Wie heißt das Wasser-Pokémon, das Professor Eich einem Trainer am Anfang schenkt?',
		answer: 'Schiggy',
		reward: 'Genau! Schiggy ist der Wasser-Starter!',
		day: 1,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 2: Starter-Entwicklungen
	{
		_id: 'evolution-bisaknosp',
		question: 'In welches Pokémon entwickelt sich Bisasam auf Level 16?',
		answer: 'Bisaknosp',
		reward: 'Stimmt! Bisasam wird zu Bisaknosp!',
		day: 2,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'evolution-glutexo',
		question: 'In welches Pokémon entwickelt sich Glumanda auf Level 16?',
		answer: 'Glutexo',
		reward: 'Richtig! Glumanda wird zu Glutexo!',
		day: 2,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'evolution-schillok',
		question: 'In welches Pokémon entwickelt sich Schiggy auf Level 16?',
		answer: 'Schillok',
		reward: 'Korrekt! Schiggy wird zu Schillok!',
		day: 2,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 3: Finale Starter-Entwicklungen
	{
		_id: 'evolution-bisaflor',
		question: 'In welches Pokémon entwickelt sich Bisaknosp auf Level 32?',
		answer: 'Bisaflor',
		reward: 'Perfekt! Bisaknosp wird zu Bisaflor!',
		day: 3,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'evolution-glurak',
		question: 'In welches Pokémon entwickelt sich Glutexo auf Level 36?',
		answer: 'Glurak',
		reward: 'Genau! Glutexo wird zu Glurak!',
		day: 3,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'evolution-turtok',
		question: 'In welches Pokémon entwickelt sich Schillok auf Level 36?',
		answer: 'Turtok',
		reward: 'Richtig! Schillok wird zu Turtok!',
		day: 3,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 4: Pikachu
	{
		_id: 'pikachu-type',
		question: 'Welchen Typ hat Pikachu?',
		answer: 'Elektro',
		reward: 'Korrekt! Pikachu ist ein Elektro-Pokémon!',
		day: 4,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'pikachu-evolution',
		question: 'In welches Pokémon entwickelt sich Pikachu mit einem Donnerstein?',
		answer: 'Raichu',
		reward: 'Richtig! Pikachu wird mit Donnerstein zu Raichu!',
		day: 4,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'pikachu-trainer',
		question: 'Wie heißt Ashes Pikachu in der deutschen Anime-Serie?',
		answer: 'Pikachu',
		reward: 'Genau! Ashes Pikachu heißt einfach Pikachu!',
		day: 4,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 5: Legendäre Vögel
	{
		_id: 'legendary-arktos',
		question: 'Wie heißt das legendäre Eis-Flug-Pokémon in der ersten Generation?',
		answer: 'Arktos',
		reward: 'Korrekt! Arktos ist der legendäre Eis-Vogel!',
		day: 5,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'legendary-zapdos',
		question: 'Wie heißt das legendäre Elektro-Flug-Pokémon in der ersten Generation?',
		answer: 'Zapdos',
		reward: 'Richtig! Zapdos ist der legendäre Elektro-Vogel!',
		day: 5,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'legendary-lavados',
		question: 'Wie heißt das legendäre Feuer-Flug-Pokémon in der ersten Generation?',
		answer: 'Lavados',
		reward: 'Genau! Lavados ist der legendäre Feuer-Vogel!',
		day: 5,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 6: Mew und Mewtu
	{
		_id: 'mew-number',
		question: 'Welche Nummer hat Mew im Pokédex der ersten Generation?',
		answer: '151',
		reward: 'Korrekt! Mew ist Pokémon Nummer 151!',
		day: 6,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'mewtu-number',
		question: 'Welche Nummer hat Mewtu im Pokédex der ersten Generation?',
		answer: '150',
		reward: 'Richtig! Mewtu ist Pokémon Nummer 150!',
		day: 6,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'mewtu-creation',
		question: 'Aus welchem Pokémon wurde Mewtu von Wissenschaftlern erschaffen?',
		answer: 'Mew',
		reward: 'Genau! Mewtu wurde aus Mews DNA erschaffen!',
		day: 6,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 7: Tausch-Entwicklungen
	{
		_id: 'trade-kadabra',
		question: 'In welches Pokémon entwickelt sich Kadabra beim Tausch?',
		answer: 'Simsala',
		reward: 'Korrekt! Kadabra wird beim Tausch zu Simsala!',
		day: 7,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'trade-machollo',
		question: 'In welches Pokémon entwickelt sich Maschock beim Tausch?',
		answer: 'Machomei',
		reward: 'Richtig! Maschock wird beim Tausch zu Machomei!',
		day: 7,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'trade-georok',
		question: 'In welches Pokémon entwickelt sich Georok beim Tausch?',
		answer: 'Geowaz',
		reward: 'Genau! Georok wird beim Tausch zu Geowaz!',
		day: 7,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 8: Stein-Entwicklungen
	{
		_id: 'stone-evoli',
		question:
			'In welche drei Pokémon kann sich Evoli mit Steinen entwickeln? (Alphabetische Reihenfolge)',
		answer: 'Aquana Blitza Flamara',
		reward: 'Perfekt! Evoli kann zu Aquana, Blitza oder Flamara werden!',
		day: 8,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'stone-vulpix',
		question: 'In welches Pokémon entwickelt sich Vulpix mit einem Feuerstein?',
		answer: 'Vulnona',
		reward: 'Korrekt! Vulpix wird mit Feuerstein zu Vulnona!',
		day: 8,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'stone-piepi',
		question: 'In welches Pokémon entwickelt sich Piepi mit einem Mondstein?',
		answer: 'Pixi',
		reward: 'Richtig! Piepi wird mit Mondstein zu Pixi!',
		day: 8,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 9: Käfer-Pokémon
	{
		_id: 'bug-raupy',
		question: 'Wie heißt das Käfer-Pokémon, das sich zu Safcon entwickelt?',
		answer: 'Raupy',
		reward: 'Korrekt! Raupy entwickelt sich zu Safcon!',
		day: 9,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'bug-safcon',
		question: 'In welches Pokémon entwickelt sich Safcon auf Level 10?',
		answer: 'Smettbo',
		reward: 'Richtig! Safcon wird zu Smettbo!',
		day: 9,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'bug-hornliu',
		question: 'Wie heißt das Käfer-Pokémon, das sich zu Kokuna entwickelt?',
		answer: 'Hornliu',
		reward: 'Genau! Hornliu entwickelt sich zu Kokuna!',
		day: 9,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 10: Normal/Flug-Pokémon
	{
		_id: 'flying-taubsi',
		question: 'Wie heißt das erste Normal-Flug-Pokémon, das man in den Spielen fangen kann?',
		answer: 'Taubsi',
		reward: 'Korrekt! Taubsi ist das erste Normal-Flug-Pokémon!',
		day: 10,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'flying-tauboga',
		question: 'In welches Pokémon entwickelt sich Taubsi auf Level 18?',
		answer: 'Tauboga',
		reward: 'Richtig! Taubsi wird zu Tauboga!',
		day: 10,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'flying-tauboss',
		question: 'In welches Pokémon entwickelt sich Tauboga auf Level 36?',
		answer: 'Tauboss',
		reward: 'Genau! Tauboga wird zu Tauboss!',
		day: 10,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 11: Wasser-Pokémon
	{
		_id: 'water-karpador',
		question: 'Wie heißt das schwache Wasser-Pokémon, das sich zu Garados entwickelt?',
		answer: 'Karpador',
		reward: 'Korrekt! Karpador wird zu Garados!',
		day: 11,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'water-garados',
		question: 'Auf welchem Level entwickelt sich Karpador zu Garados?',
		answer: '20',
		reward: 'Richtig! Karpador entwickelt sich auf Level 20!',
		day: 11,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'water-lapras',
		question: 'Wie heißt das seltene Wasser-Eis-Pokémon, das man in der Blauen Höhle findet?',
		answer: 'Lapras',
		reward: 'Genau! Lapras ist in der Blauen Höhle zu finden!',
		day: 11,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 12: Gestein/Boden-Pokémon
	{
		_id: 'rock-kleinstein',
		question: 'Wie heißt das Gestein-Pokémon, das sich zu Georok entwickelt?',
		answer: 'Kleinstein',
		reward: 'Korrekt! Kleinstein wird zu Georok!',
		day: 12,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'rock-georok',
		question: 'In welches Pokémon entwickelt sich Georok beim Tausch?',
		answer: 'Geowaz',
		reward: 'Richtig! Georok wird beim Tausch zu Geowaz!',
		day: 12,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'ground-digda',
		question: 'Wie heißt das Boden-Pokémon, das sich zu Digdri entwickelt?',
		answer: 'Digda',
		reward: 'Genau! Digda wird zu Digdri!',
		day: 12,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'ground-ponita',
		question: 'Auf welchem Level entwickelt sich Ponita zu Gallopa?',
		answer: '40',
		reward: 'Korrekt! Ponita entwickelt sich auf Level 40 zu Gallopa!',
		day: 12,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 13: Geist/Gift-Pokémon
	{
		_id: 'ghost-nebulak',
		question: 'Wie heißt das Geist-Pokémon, das man im Pokémon-Turm findet?',
		answer: 'Nebulak',
		reward: 'Korrekt! Nebulak ist im Pokémon-Turm!',
		day: 13,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'ghost-alpollo',
		question: 'In welches Pokémon entwickelt sich Nebulak auf Level 25?',
		answer: 'Alpollo',
		reward: 'Richtig! Nebulak wird zu Alpollo!',
		day: 13,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'ghost-gengar',
		question: 'In welches Pokémon entwickelt sich Alpollo beim Tausch?',
		answer: 'Gengar',
		reward: 'Genau! Alpollo wird beim Tausch zu Gengar!',
		day: 13,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 14: Psycho-Pokémon
	{
		_id: 'psychic-abra',
		question: 'Wie heißt das Psycho-Pokémon, das sich sofort zu Kadabra entwickelt?',
		answer: 'Abra',
		reward: 'Korrekt! Abra entwickelt sich sofort zu Kadabra!',
		day: 14,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'psychic-mew',
		question: 'Welchen Typ hat Mew?',
		answer: 'Psycho',
		reward: 'Richtig! Mew ist ein Psycho-Pokémon!',
		day: 14,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'psychic-mewtu',
		question: 'Welchen Typ hat Mewtu?',
		answer: 'Psycho',
		reward: 'Genau! Mewtu ist ein Psycho-Pokémon!',
		day: 14,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 15: Feuer-Pokémon
	{
		_id: 'fire-fukano',
		question: 'Wie heißt das Feuer-Pokémon, das sich zu Arkani entwickelt?',
		answer: 'Fukano',
		reward: 'Korrekt! Fukano wird zu Arkani!',
		day: 15,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'fire-arkani',
		question: 'Auf welchem Level entwickelt sich Fukano zu Arkani?',
		answer: '36',
		reward: 'Richtig! Fukano entwickelt sich auf Level 36!',
		day: 15,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'fire-magmar',
		question: 'Wie heißt das Feuer-Pokémon, das man in der Feuerinsel-Höhle findet?',
		answer: 'Magmar',
		reward: 'Genau! Magmar ist in der Feuerinsel-Höhle!',
		day: 15,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 16: Elektro-Pokémon
	{
		_id: 'electric-porenta',
		question: 'Wie heißt das Elektro-Pokémon, das man im Kraftwerk findet? (LOL KI)',
		answer: 'Porenta',
		reward: 'Korrekt! Porenta ist im Kraftwerk zu finden!',
		day: 16,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'electric-voltobal',
		question: 'Wie heißt das Elektro-Pokémon, das wie eine Pokéball aussieht?',
		answer: 'Voltobal',
		reward: 'Richtig! Voltobal sieht aus wie ein Pokéball!',
		day: 16,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'electric-lektrobal',
		question: 'In welches Pokémon entwickelt sich Voltobal auf Level 30?',
		answer: 'Lektrobal',
		reward: 'Genau! Voltobal wird zu Lektrobal!',
		day: 16,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 17: Eis-Pokémon
	{
		_id: 'ice-arktos',
		question: 'Welches legendäre Pokémon hat den Typ Eis und Flug?',
		answer: 'Arktos',
		reward: 'Korrekt! Arktos ist Eis-Flug!',
		day: 17,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'ice-lapras',
		question: 'Welches Wasser-Pokémon hat auch den Typ Eis?',
		answer: 'Lapras',
		reward: 'Richtig! Lapras ist Wasser-Eis!',
		day: 17,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 18: Drachen-Pokémon
	{
		_id: 'dragon-dratini',
		question: 'Wie heißt das erste Drachen-Pokémon, das man im Spiel fangen kann?',
		answer: 'Dratini',
		reward: 'Korrekt! Dratini ist das erste Drachen-Pokémon!',
		day: 18,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'dragon-dragonir',
		question: 'In welches Pokémon entwickelt sich Dratini auf Level 30?',
		answer: 'Dragonir',
		reward: 'Richtig! Dratini wird zu Dragonir!',
		day: 18,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'dragon-dragoran',
		question: 'In welches Pokémon entwickelt sich Dragonir auf Level 55?',
		answer: 'Dragoran',
		reward: 'Genau! Dragonir wird zu Dragoran!',
		day: 18,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 19: Kampf-Pokémon
	{
		_id: 'fighting-machollo',
		question: 'Wie heißt das Kampf-Pokémon, das sich zu Maschock entwickelt?',
		answer: 'Machollo',
		reward: 'Korrekt! Machollo wird zu Maschock!',
		day: 19,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'fighting-maschock',
		question: 'Auf welchem Level entwickelt sich Machollo zu Maschock?',
		answer: '28',
		reward: 'Richtig! Machollo entwickelt sich auf Level 28 zu Maschock!',
		day: 19,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'fighting-machomei',
		question: 'In welches Pokémon entwickelt sich Maschock beim Tausch?',
		answer: 'Machomei',
		reward: 'Genau! Maschock wird beim Tausch zu Machomei!',
		day: 19,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'fighting-menki',
		question: 'Wie heißt das Kampf-Pokémon, das sich zu Rasaff entwickelt?',
		answer: 'Menki',
		reward: 'Genau! Menki wird zu Rasaff!',
		day: 19,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 20: Anime - Ashes Team
	{
		_id: 'anime-ash-pikachu',
		question: 'Welches Pokémon ist Ashes treuester Begleiter?',
		answer: 'Pikachu',
		reward: 'Korrekt! Pikachu ist Ashes bester Freund!',
		day: 20,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'anime-ash-tauboga',
		question: 'Welches Normal-Flug-Pokémon hat Ash in der ersten Staffel gefangen?',
		answer: 'Tauboga',
		reward: 'Richtig! Ash hat ein Tauboga gefangen!',
		day: 20,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'anime-ash-schiggy',
		question: 'Welches Starter-Pokémon hat Ash von Professor Eich erhalten? (LOL AI)',
		answer: 'Schiggy',
		reward: 'Genau! Ash hat Schiggy bekommen!',
		day: 20,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 21: Anime - Team Rocket
	{
		_id: 'anime-rocket-jessie',
		question: 'Wie heißt die weibliche Mitglied von Team Rocket?',
		answer: 'Jessie',
		reward: 'Korrekt! Jessie ist Mitglied von Team Rocket!',
		day: 21,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'anime-rocket-james',
		question: 'Wie heißt der männliche Mitglied von Team Rocket?',
		answer: 'James',
		reward: 'Richtig! James ist Mitglied von Team Rocket!',
		day: 21,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'anime-rocket-meowth',
		question: 'Welches Pokémon spricht in Team Rocket?',
		answer: 'Mauzi',
		reward: 'MiauZ! Genau! Mauzi kann sprechen!',
		day: 21,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 22: Erster Film - Mew und Mewtu
	{
		_id: 'movie-mew',
		question: 'Welches legendäre Pokémon ist der Star des ersten Pokémon-Films?',
		answer: 'Mew',
		reward: 'Korrekt! Mew ist der Star des ersten Films!',
		day: 22,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'movie-mewtu',
		question: 'Welches Pokémon ist der Antagonist im ersten Pokémon-Film?',
		answer: 'Mewtu',
		reward: 'Richtig! Mewtu ist der Antagonist!',
		day: 22,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'movie-title',
		question: 'Wie heißt der erste Pokémon-Film auf Deutsch?',
		answer: 'Mewtu schlägt zurück',
		reward: 'Genau! Der Film heißt "Mewtu schlägt zurück"!',
		day: 22,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 23: Spiel-Mechaniken
	{
		_id: 'game-pokedex',
		question: 'Wie viele Pokémon gibt es in der ersten Generation?',
		answer: '151',
		reward: 'Korrekt! Es gibt 151 Pokémon in der ersten Generation!',
		day: 23,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'game-evolution-stone',
		question: 'Wie viele verschiedene Entwicklungssteine gibt es in den ersten Spielen?',
		answer: '5',
		reward: 'Richtig! Es gibt 5 Entwicklungssteine!',
		day: 23,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'game-starter-choice',
		question: 'Wie viele Starter-Pokémon kann man am Anfang wählen?',
		answer: '3',
		reward: 'Genau! Man kann zwischen 3 Startern wählen!',
		day: 23,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	// Tag 24: Legendäre und Besondere Pokémon
	{
		_id: 'legendary-all-birds',
		question:
			'Wie heißen die drei legendären Vögel der ersten Generation? (Alphabetische Reihenfolge)',
		answer: 'Arktos Lavados Zapdos',
		reward: 'Perfekt! Arktos, Zapdos und Lavados sind die legendären Vögel!',
		day: 24,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'legendary-mew',
		question: 'Welches Pokémon ist das letzte im Pokédex der ersten Generation?',
		answer: 'Mew',
		reward: 'Korrekt! Mew ist Nummer 151!',
		day: 24,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'legendary-mewtu',
		question: 'Wo findet man Mewtu in Pokémon Rot und Blau?',
		answer: 'Blauen Höhle',
		reward: 'Richtig! Mewtu ist in der Blauen Höhle!',
		day: 24,
		createdAt: new Date(),
		updatedAt: new Date()
	}
];

async function seed() {
	const client = new MongoClient(uri);

	try {
		await client.connect();
		console.log('Connected to MongoDB');

		const db = client.db(dbName);
		const collection = db.collection<Question>('questions');

		for (const question of sampleQuestions) {
			const now = new Date();
			await collection.updateOne(
				{ _id: question._id },
				{
					$set: {
						question: question.question,
						answer: question.answer,
						reward: question.reward,
						day: question.day,
						updatedAt: now
					},
					$setOnInsert: {
						createdAt: question.createdAt ?? now
					}
				},
				{ upsert: true }
			);
		}

		console.log(`Upserted ${sampleQuestions.length} questions`);
	} catch (error) {
		console.error('Error seeding database:', error);
		// Don't exit with error code - let the app start anyway
		throw error;
	} finally {
		await client.close();
		console.log('Disconnected from MongoDB');
	}
}

seed();
