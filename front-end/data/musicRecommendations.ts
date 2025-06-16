// data/musicRecommendations.ts
import { RecommendationsMap, MusicRecommendation } from "@/types"; // 타입 임포트

export const musicRecommendations: RecommendationsMap<MusicRecommendation> = {
  happy: [
    { title: "Happy", artist: "Pharrell Williams", genre: "Pop" },
    { title: "Good as Hell", artist: "Lizzo", genre: "Pop" },
    { title: "Can't Stop the Feeling", artist: "Justin Timberlake", genre: "Pop" },
  ],
  sad: [
    { title: "Someone Like You", artist: "Adele", genre: "Ballad" },
    { title: "Mad World", artist: "Gary Jules", genre: "Alternative" },
    { title: "Hurt", artist: "Johnny Cash", genre: "Country" },
  ],
  stressed: [
    { title: "Weightless", artist: "Marconi Union", genre: "Ambient" },
    { title: "Clair de Lune", artist: "Claude Debussy", genre: "Classical" },
    { title: "Aqueous Transmission", artist: "Incubus", genre: "Alternative" },
  ],
  calm: [
    { title: "River", artist: "Joni Mitchell", genre: "Folk" },
    { title: "Mad About You", artist: "Sting", genre: "Jazz" },
    { title: "The Night We Met", artist: "Lord Huron", genre: "Indie Folk" },
  ],
  excited: [
    { title: "Uptown Funk", artist: "Bruno Mars", genre: "Funk" },
    { title: "I Gotta Feeling", artist: "Black Eyed Peas", genre: "Pop" },
    { title: "Pump It", artist: "Black Eyed Peas", genre: "Hip Hop" },
  ],
  tired: [
    { title: "Sleepyhead", artist: "Passion Pit", genre: "Indie Pop" },
    { title: "Dream a Little Dream", artist: "Ella Fitzgerald", genre: "Jazz" },
    { title: "Lullaby", artist: "Brahms", genre: "Classical" },
  ],
};