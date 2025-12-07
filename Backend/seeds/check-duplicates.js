const data = require('./movie-role-mapping.seed.js');

const seen = new Map();
const dupes = [];

data.forEach((item, idx) => {
  const key = `${item.movieRef}-${item.personRef}`;
  if (seen.has(key)) {
    dupes.push({
      index: idx,
      movie: item.movieRef,
      person: item.personRef,
      role: item.role,
      firstIndex: seen.get(key),
      firstRole: data[seen.get(key)].role
    });
  } else {
    seen.set(key, idx);
  }
});

console.log('Found', dupes.length, 'duplicates:\n');
dupes.forEach(d => {
  console.log(`Line ~${(d.index * 10) + 5}: ${d.movie} - ${d.person}`);
  console.log(`  First appearance (index ${d.firstIndex}): ${d.firstRole}`);
  console.log(`  Duplicate (index ${d.index}): ${d.role}\n`);
});
