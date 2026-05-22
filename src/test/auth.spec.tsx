import { describe, expect, it } from 'vitest';
import { getFrontendRole } from '../app/pages/Login';

describe('Frontend Role Extraction', () => {
  it('should map Spanish roles correctly', () => {
    expect(getFrontendRole({ rol: 'paciente' })).toBe('patient');
    expect(getFrontendRole({ rol: 'medico' })).toBe('doctor');
    expect(getFrontendRole({ rol: 'admin' })).toBe('admin');
  });

  it('should map English roles correctly', () => {
    expect(getFrontendRole({ role: 'patient' })).toBe('patient');
    expect(getFrontendRole({ role: 'doctor' })).toBe('doctor');
    expect(getFrontendRole({ role: 'admin' })).toBe('admin');
  });

  it('should extract from backend roles array', () => {
    expect(getFrontendRole({ roles: ['paciente'] })).toBe('patient');
    expect(getFrontendRole({ roles: ['medico'] })).toBe('doctor');
    expect(getFrontendRole({ roles: ['admin'] })).toBe('admin');
  });

  it('should fallback to patient for unknown role', () => {
    expect(getFrontendRole({ rol: 'unknown' })).toBe('patient');
    expect(getFrontendRole({})).toBe('patient');
  });
});
