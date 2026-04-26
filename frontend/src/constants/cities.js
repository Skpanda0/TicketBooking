export const CITY_MOVIES = {
  Delhi: ["Pushpa: The Rule - Part 2", "RRR", "The Batman", "Vanvaas", "Jailer"],
  Bengaluru: ["Pushpa: The Rule - Part 2", "Mufasa: The Lion King", "Jailer"],
  Hyderabad: [
    "Pushpa: The Rule - Part 2",
    "Vanvaas",
    "Marco",
    "Solo Leveling: ReAwakening",
  ],
  Mumbai: [
    "RRR",
    "The Batman",
    "Pushpa: The Rule - Part 2",
    "Demon Slayer: Kimetsu no Yaiba - The Movie: Mugen Train",
    "Jujutsu Kaisen 0",
    "Jailer",
    "Vanvaas",
  ],
  Berhampur: ["RRR", "Pushpa: The Rule - Part 2", "Daman", "Jailer"],
};

export const CITIES = Object.keys(CITY_MOVIES);

export const MOVIE_TITLES = [...new Set(Object.values(CITY_MOVIES).flat())];
