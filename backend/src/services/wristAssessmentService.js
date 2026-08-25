import { apiError } from '../utils/http.js';

const SECTIONS = [
  'inspection',
  'palpation',
  'articular',
  'muscular',
  'neurological',
  'specialTests',
  'functional',
  'outcomeMeasure',
  'clinicalReasoning',
];

function object(value, path) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw apiError(`${path} must be an object`, 400);
  return value;
}

function string(value, path, maximum = 5000) {
  if (value === '' || value === undefined || value === null) return;
  if (typeof value !== 'string' || value.length > maximum) throw apiError(`${path} must be valid text`, 400);
}

function number(value, path, minimum = -100000, maximum = 100000) {
  if (value === '' || value === undefined || value === null) return;
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < minimum || numeric > maximum) throw apiError(`${path} must be between ${minimum} and ${maximum}`, 400);
}

function bool(value, path) {
  if (value !== '' && value !== undefined && value !== null && typeof value !== 'boolean') throw apiError(`${path} must be true, false, or empty`, 400);
}

function inspect(value, path) {
  if (value === '' || value === undefined || value === null) return;
  if (typeof value === 'string') return string(value, path);
  if (typeof value === 'number') return number(value, path);
  if (typeof value === 'boolean') return bool(value, path);
  if (Array.isArray(value)) {
    if (value.length > 100) throw apiError(`${path} contains too many values`, 400);
    value.forEach((item, index) => inspect(item, `${path}.${index}`));
    return;
  }
  const nested = object(value, path);
  if (Object.keys(nested).length > 100) throw apiError(`${path} contains unsupported fields`, 400);
  Object.entries(nested).forEach(([key, entry]) => inspect(entry, `${path}.${key}`));
}

export function validateWristAssessmentData(value, { completed = false } = {}) {
  const data = object(value, 'assessment_data');
  if (JSON.stringify(data).length > 250000) throw apiError('Assessment data is too large', 413);
  const unknown = Object.keys(data).filter((key) => !SECTIONS.includes(key));
  if (unknown.length) throw apiError('assessment_data contains unsupported fields', 400);
  if (completed) {
    const missing = SECTIONS.filter((key) => !data[key]);
    if (missing.length) throw apiError('All assessment sections must be present before completion', 400);
  }
  SECTIONS.forEach((key) => { if (data[key] !== undefined) inspect(data[key], `assessment_data.${key}`); });
  return data;
}
