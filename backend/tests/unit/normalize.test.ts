// backend/tests/unit/categoryRules.test.ts
import { describe, it, expect } from 'vitest'
import { normalizeName } from '../../src/utils/normalize';

describe('normalizeName', () => {
  it('remove espaços extras no início e no fim', () => {
    expect(normalizeName('  exemplo  ')).toBe('exemplo')
  })
  it('substitui múltiplos espaços por um único espaço', () => {
    expect(normalizeName('exemplo    de   nome')).toBe('exemplo de nome')
  })
  it('converte para minúsculas', () => {
    expect(normalizeName('ExEmPlO')).toBe('exemplo')
  })
  it('combina todas as normalizações', () => {
    expect(normalizeName('  ExEmPlO    De   NoMe  ')).toBe('exemplo de nome')
  })
})