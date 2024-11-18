export default function createSlug(text: string): string {
    // Normalize the string by removing accents and diacritics
    const normalizedText = text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

    // Convert the string to lowercase
    const lowercasedText = normalizedText.toLowerCase();

    // Replace spaces and symbols with hyphens, and remove any non-alphanumeric characters
    const slug = lowercasedText
        .replace(/[^a-z0-9\s-]/g, '') // Remove any non-alphanumeric characters except space and hyphen
        .trim() // Remove leading and trailing spaces
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Collapse multiple hyphens into one
        .replace(/^-+/, '') // Remove leading hyphens
        .replace(/-+$/, ''); // Remove trailing hyphens

    return slug;
}
