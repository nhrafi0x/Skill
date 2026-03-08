const fs = require('fs');

let content = fs.readFileSync('src/data.ts', 'utf8');

// We will replace the CAREER_DIRECTORY array with a modified version
// But since it's a TS file, we can just use regex or eval if we extract the array.
// Actually, it's easier to just write a simple parser or use regex.

const levels = ['Core', 'Intermediate', 'Advanced'];

content = content.replace(/skills:\s*\[(.*?)\]/g, (match, skillsStr) => {
  const skills = skillsStr.split(',').map(s => s.trim().replace(/"/g, ''));
  
  let breakdown = `\n    skillBreakdown: [\n`;
  skills.forEach((skill, index) => {
    if (!skill) return;
    const level = levels[index % 3];
    breakdown += `      { name: "${skill}", level: "${level}", importance: "Crucial for mastering ${skill.toLowerCase()} in this role.", resource: { title: "Learn ${skill}", url: "https://www.google.com/search?q=learn+${encodeURIComponent(skill)}" } },\n`;
  });
  breakdown += `    ],`;
  
  return match + `,` + breakdown;
});

content = content.replace(/export interface JobProfile \{([\s\S]*?)\}/, (match, inner) => {
  if (!inner.includes('skillBreakdown')) {
    return `export interface JobProfile {${inner}  skillBreakdown?: { name: string; level: 'Core' | 'Intermediate' | 'Advanced'; importance: string; resource: { title: string; url: string } }[];\n}`;
  }
  return match;
});

fs.writeFileSync('src/data.ts', content);
console.log('Done');
