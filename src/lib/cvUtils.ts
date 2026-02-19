/**
 * Selects up to 'limit' skills, prioritizing those explicitly selected by the user.
 * If the user has fewer than 'limit' skills, fills the rest with skills suggested by the AI.
 * 
 * @param userSkills - Skills explicitly chosen/entered by the user
 * @param aiSkills - Skills generated/extracted by the AI from the CV text
 * @param limit - Total number of skills to return (default 5)
 * @returns An array of prioritized skills
 */
export function getPrioritySkills(userSkills: string[] = [], aiSkills: string[] = [], limit: number = 5): string[] {
    // If user has chosen 5 or more, just use the first 5 user skills
    if (userSkills.length >= limit) {
        return userSkills.slice(0, limit);
    }

    // Otherwise, take all user skills and fill with AI skills that aren't already included
    const result = [...userSkills];

    for (const aiSkill of aiSkills) {
        if (result.length >= limit) break;

        // Check if AI skill is already in result (case insensitive)
        const exists = result.some(s => s.toLowerCase() === aiSkill.toLowerCase());
        if (!exists) {
            result.push(aiSkill);
        }
    }

    return result;
}
