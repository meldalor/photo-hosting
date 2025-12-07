import { Gallery, PhotoCard } from './index'

describe('index exports', () => {
  test('exports Gallery component', () => {
    expect(Gallery).toBeDefined()
    expect(typeof Gallery).toBe('function')
  })

  test('exports PhotoCard component', () => {
    expect(PhotoCard).toBeDefined()
    expect(typeof PhotoCard).toBe('function')
  })
})
