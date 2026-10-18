import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export async function loadBebasFont() {
  return readFile(join(process.cwd(), 'public/fonts/BebasNeue.woff'))
}

export function monogramStyle(background: string, fontSize: number) {
  return {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: background,
    fontFamily: 'Bebas',
    fontSize,
    color: '#ffffff',
  }
}
