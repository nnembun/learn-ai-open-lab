export type PromptDraft = {
  id: number | string
  title: string
  promptA: string
  promptB: string
  notes: string
  updated: string
}

export const qualityItems = [
  ['clarity', 'Clarity'],
  ['context', 'Context'],
  ['instructions', 'Instructions'],
  ['constraints', 'Constraints'],
  ['format', 'Output format'],
] as const

export function scorePrompt(prompt: string): number {
  const text = prompt.toLowerCase()
  const signals = [
    text.length > 55,
    /audience|for |situation|background|commuter|12-year/.test(text),
    /write|create|explain|turn|help|make|give/.test(text),
    /under|word|keep|avoid|budget|40–60|length/.test(text),
    /table|options|timeline|list|markdown|each/.test(text),
  ]
  return signals.filter(Boolean).length
}

export function upsertPrompt(prompts: PromptDraft[], draft: PromptDraft): PromptDraft[] {
  return [draft, ...prompts.filter((prompt) => prompt.id !== draft.id)]
}

export function deletePrompt(prompts: PromptDraft[], id: PromptDraft['id']): PromptDraft[] {
  return prompts.filter((prompt) => prompt.id !== id)
}

export function serializePrompts(prompts: PromptDraft[], format: 'json' | 'csv'): string {
  if (format === 'json') return JSON.stringify(prompts, null, 2)
  const escape = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`
  return [
    'title,promptA,promptB,notes',
    ...prompts.map((prompt) => [prompt.title, prompt.promptA, prompt.promptB, prompt.notes].map(escape).join(',')),
  ].join('\n')
}

export function parsePrompts(value: string, format: 'json' | 'csv'): PromptDraft[] {
  if (format === 'json') {
    const parsed: unknown = JSON.parse(value)
    if (!Array.isArray(parsed)) throw new Error('Prompt import must be a JSON array')
    return parsed.map((item, index) => {
      if (!item || typeof item !== 'object') throw new Error(`Invalid prompt at index ${index}`)
      const record = item as Record<string, unknown>
      if (typeof record.title !== 'string' || typeof record.promptA !== 'string') throw new Error(`Invalid prompt at index ${index}`)
      return {
        id: typeof record.id === 'string' || typeof record.id === 'number' ? record.id : `import-${index}`,
        title: record.title,
        promptA: record.promptA,
        promptB: typeof record.promptB === 'string' ? record.promptB : '',
        notes: typeof record.notes === 'string' ? record.notes : '',
        updated: typeof record.updated === 'string' ? record.updated : new Date(0).toISOString(),
      }
    })
  }
  const rows = value.trim().split(/\r?\n/)
  if (rows.length < 2 || rows[0] !== 'title,promptA,promptB,notes') throw new Error('CSV must use the exported prompt format')
  return rows.slice(1).map((row, index) => {
    const values = [...row.matchAll(/"((?:[^"]|"")*)"/g)].map((match) => match[1].replaceAll('""', '"'))
    if (values.length !== 4) throw new Error(`Invalid CSV row at index ${index + 1}`)
    return { id: `import-${index}`, title: values[0], promptA: values[1], promptB: values[2], notes: values[3], updated: new Date(0).toISOString() }
  })
}

export function compareResponses(responseA: string, responseB: string) {
  const wordsA = new Set(responseA.toLowerCase().match(/[a-z0-9]+/g) ?? [])
  const wordsB = new Set(responseB.toLowerCase().match(/[a-z0-9]+/g) ?? [])
  const shared = [...wordsA].filter((word) => wordsB.has(word))
  return { sharedWords: shared, lengthA: responseA.length, lengthB: responseB.length, hasBothResponses: Boolean(responseA.trim() && responseB.trim()) }
}
