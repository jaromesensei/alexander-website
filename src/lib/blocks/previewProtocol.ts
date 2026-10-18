import type { Block } from './types'

/**
 * הודעות בין העורך לתצוגה המקדימה (iframe באותו origin).
 * העורך שולח את הבלוקים בכל שינוי; התצוגה מדווחת על לחיצה על בלוק.
 */
export type EditorMessage = {
  source: 'alex-editor'
  type: 'state'
  blocks: Block[]
  selectedId: string | null
  /** לגלול לבלוק הנבחר (כשהבחירה הגיעה מהעורך, לא מלחיצה בתצוגה) */
  scroll: boolean
}

export type PreviewMessage =
  | { source: 'alex-preview'; type: 'ready' }
  | { source: 'alex-preview'; type: 'select'; id: string }

export const PREVIEW_PATH = '/admin/preview'
