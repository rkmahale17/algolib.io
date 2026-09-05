export function getProblemUrl(algorithm: any): string {
  const baseId = algorithm.slug || algorithm.id;
  const type = algorithm.problemType || algorithm.problem_type;
  
  if (type === 'frontend') {
    return `/frontend/blind75/${baseId}`;
  } else if (type === 'sql' || type === 'SQL') {
    return `/problem/sql/${baseId}`;
  }
  
  return `/problem/${baseId}`;
}
