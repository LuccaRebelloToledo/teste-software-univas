import { describe, it, expect } from 'vitest'
import { canTransition } from '../../src/utils/taskRules'

describe('canTransition', () => {
  it('permite transição de PENDING para IN_PROGRESS', () => {
    expect(canTransition('PENDING', 'IN_PROGRESS')).toBe(true)
  })
  it('permite transição de IN_PROGRESS para COMPLETED', () => {
    expect(canTransition('IN_PROGRESS', 'COMPLETED')).toBe(true)
  })
  it('permite transição de IN_PROGRESS para CANCELLED', () => {
    expect(canTransition('IN_PROGRESS', 'CANCELLED')).toBe(true)
  })
  it('bloqueia transição de COMPLETED para qualquer outro status', () => {
    expect(canTransition('COMPLETED', 'PENDING')).toBe(false)
    expect(canTransition('COMPLETED', 'IN_PROGRESS')).toBe(false)
    expect(canTransition('COMPLETED', 'CANCELLED')).toBe(false)
  })
  it('bloqueia transição de CANCELLED para qualquer outro status', () => {
    expect(canTransition('CANCELLED', 'PENDING')).toBe(false)
    expect(canTransition('CANCELLED', 'IN_PROGRESS')).toBe(false)
    expect(canTransition('CANCELLED', 'COMPLETED')).toBe(false) 
  })
})
