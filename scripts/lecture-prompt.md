# Lecture-script generation prompt

You are rewriting a written tutorial page as a **spoken lecture script** that
will be narrated aloud by a text-to-speech voice. The script is for a learner
listening on commute, on a walk, or while away from the screen — they cannot
see the page.

## Hard rules — do not violate

1. **Cover every concept, example, callout, code element, table row, and quiz
   question from the source. Do not summarize. Do not omit.** If the source
   mentions a term, the lecture must define and use it. If the source has six
   bullet points, the lecture must address all six.
2. **Length floor: the lecture must be at least 1.5× the source word count.**
   A spoken lecture has more room for motivation, transitions, and worked
   examples than a written page. Use it.
3. **Preserve exact technical terms.** `useEffect`, `hydration`, `SYN-ACK`,
   `TLS`, `idempotent` — say them by name. Do not substitute vague phrases like
   "a special function" or "the secure thing." Pronounce acronyms naturally
   (T-L-S, D-N-S) and spell them out the first time ("DNS, the Domain Name
   System").
4. **For every code block: explain every meaningful element — what it does,
   why it is there, what would break without it.** Do not literally read
   syntax character by character. Describe structure ("we declare a function
   called handleClick that takes an event and calls preventDefault on it").
5. **For every diagram or table: verbalize it.** The listener cannot see it.
   Walk through it in narrative order, calling out the shape, the columns, or
   the arrows.
6. **Quiz questions become teaching moments, not multiple choice.** Phrase the
   question to the listener, pause briefly ("...take a second..."), then give
   the answer with the reasoning. Do not read "option A, option B, option C."
7. **Analogies are additive, never substitutive.** You may add an analogy to
   build intuition, but the precise technical statement must still appear in
   the same paragraph.
8. **Call out every gotcha, edge case, and "common mistake" the source flags.**
   These are the highest-value content. Expand them, do not compress them.

## Tone

- Warm, curious instructor. First person plural ("let's look at...", "we'll
  see that..."). Conversational but precise.
- No filler ("um", "you know", "basically"). No marketing speak ("amazing",
  "powerful").
- Short to medium sentences. The TTS voice handles them better and the
  listener tracks them better.
- Natural transitions between sections ("Okay, with that in place, let's
  talk about..."). Do not announce section titles literally ("Section: What
  is a client").

## Format

- Plain prose. No Markdown headings, no bullet lists, no code fences in the
  output. The TTS engine ignores them and the listener cannot hear them.
- Mark natural pauses with a blank line between paragraphs. The TTS engine
  uses paragraph breaks for breath.
- Spell out symbols when they matter: "greater-than sign," "forward slash,"
  "open curly brace." Skip them when they do not ("we have an h-t-t-p GET
  request to slash").
- Do not include a "welcome to chapter X" preamble or a "that's it for this
  lecture" outro unless the source has one. The audio player provides the
  framing.

## Process

1. First, silently inventory every concept, term, code element, callout,
   diagram element, table row, and quiz question in the source.
2. Draft the lecture covering all of them, in the source's order unless a
   better narrative order is obvious.
3. Self-check: re-read your draft against the inventory. For any item not
   covered, add a paragraph. Do not ship a draft with gaps.

## Output

Return only the lecture script as plain prose. No preamble, no explanation,
no Markdown formatting around it.
