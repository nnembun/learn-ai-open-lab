import { describe, expect, it } from 'vitest'
import { compareResponses, deletePrompt, parsePrompts, scorePrompt, serializePrompts, upsertPrompt, type PromptDraft } from '../src/promptLab'

const draft = (id: number, title = 'First prompt'): PromptDraft => ({ id, title, promptA: 'Write a clear launch announcement for commuters under 100 words.', promptB: 'Write a launch post.', notes: 'Test note', updated: '2026-11-11T00:00:00.000Z' })

describe('prompt quality scoring', () => {
  it('rewards clarity, context, instructions, constraints and format', () => expect(scorePrompt('Write a clear launch announcement for commuters. Keep it under 100 words and return a markdown table of options.')).toBe(5))
  it('does not over-score a vague prompt', () => expect(scorePrompt('Tell me something')).toBeLessThan(3))
})

describe('prompt persistence operations', () => {
  it('saves and edits without duplicating a prompt', () => {
    const saved = upsertPrompt([], draft(1))
    expect(upsertPrompt(saved, { ...draft(1), title: 'Edited prompt' })).toHaveLength(1)
    expect(upsertPrompt(saved, { ...draft(1), title: 'Edited prompt' })[0].title).toBe('Edited prompt')
  })
  it('deletes by id', () => expect(deletePrompt([draft(1), draft(2)], 1)).toEqual([draft(2)]))
})

describe('prompt import and export', () => {
  it('round trips JSON', () => expect(parsePrompts(serializePrompts([draft(1)], 'json'), 'json')[0]).toMatchObject({ title: 'First prompt', promptA: expect.stringContaining('launch') }))
  it('round trips CSV with quoted commas', () => { const imported = parsePrompts(serializePrompts([{ ...draft(1), notes: 'Notice, tone' }], 'csv'), 'csv'); expect(imported[0].notes).toBe('Notice, tone') })
  it('rejects malformed imports', () => expect(() => parsePrompts('{"nope":true}', 'json')).toThrow())
})

describe('response comparison', () => {
  it('finds shared words and response lengths', () => expect(compareResponses('A clear answer for beginners', 'A clear answer for teams')).toMatchObject({ hasBothResponses: true, lengthA: 28, lengthB: 24, sharedWords: expect.arrayContaining(['a', 'clear', 'answer']) }))
  it('reports an empty comparison until both responses exist', () => expect(compareResponses('', 'some answer').hasBothResponses).toBe(false))
})
