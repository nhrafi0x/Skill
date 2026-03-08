import * as fs from 'fs';

let content = fs.readFileSync('src/data.ts', 'utf8');

const levels = ['Core', 'Intermediate', 'Advanced'];

content = content.replace(/skills:\s*\[(.*?)\]/g, (match, skillsStr) => {
  const skills = skillsStr.split(',').map(s => s.trim().replace(/"/g, ''));
  
  let breakdown = `\n    skillBreakdown: [`;
  skills.forEach((skill, index) => {
    if (!skill) return;
    const level = levels[index % 3];
    breakdown += `\n      { name: "${skill}", level: "${level}" as const, importance: "Crucial for mastering ${skill.toLowerCase()} in this role.", resource: { title: "Learn ${skill}", url: "https://www.google.com/search?q=learn+${encodeURIComponent(skill)}" } },`;
  });
  breakdown += `\n    ]`;
  
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
