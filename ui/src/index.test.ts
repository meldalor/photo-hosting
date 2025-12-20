import { Gallery, PhotoCard, Button, Input, Form } from './index'

describe('index exports', () => {
  test('exports Gallery component', () => {
    expect(Gallery).toBeDefined()
    expect(typeof Gallery).toBe('function')
  })

  test('exports PhotoCard component', () => {
    expect(PhotoCard).toBeDefined()
    expect(typeof PhotoCard).toBe('function')
  })

  test('exports Button component', () => {
    expect(Button).toBeDefined()
    expect(typeof Button).toBe('function')
  })

  test('exports Input component', () => {
    expect(Input).toBeDefined()
    expect(typeof Input).toBe('function')
  })

  test('exports Form component', () => {
    expect(Form).toBeDefined()
    expect(typeof Form).toBe('function')
  })
})
