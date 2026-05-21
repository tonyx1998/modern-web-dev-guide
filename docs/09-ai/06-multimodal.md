---
id: ai-multimodal
title: 'Pattern 6: Multimodal AI'
sidebar_position: 7
sidebar_label: 6. Multimodal
description: Models that handle text + images + audio + video. OCR, alt text, voice agents, frame-level video analysis.
---

# Pattern 6: Multimodal AI

> **In one line:** Modern frontier models accept images (and increasingly audio and video) alongside text — enabling OCR, accessibility, document parsing, voice agents, and visual understanding without separate ML pipelines.

:::tip In plain English
Two years ago, "parse a receipt" was a separate ML project. In 2026, you hand the image to Claude or Gemini and ask "what's the total?" The same models that handle chat now read documents, describe images for accessibility, transcribe speech, and analyze video frames. Multimodal is just *another modality of the same prompt*.
:::

Models that handle text + images + audio + video.

## Vision

```typescript
const result = await generateText({
  model: anthropic('claude-sonnet-4-5'),
  messages: [{
    role: 'user',
    content: [
      { type: 'text', text: 'What\'s in this image?' },
      { type: 'image', image: imageBuffer },
    ],
  }],
});
```

> **In English:** A user message can now be a *list* of parts — some text, some images. The model reads them together. No separate "vision API" call; vision is just another content type in the same prompt.

Use cases:

- OCR / document parsing.
- Image categorization.
- Accessibility (alt text generation).
- UI testing (verify visual changes).
- Receipt processing.
- Inventory management.

## Audio

- **Speech-to-text** (Whisper, Deepgram, AssemblyAI).
- **Text-to-speech** (ElevenLabs, OpenAI TTS, Cartesia).
- **Voice agents** combining the two.

## Video

- Frame extraction + image analysis.
- Native video models (emerging in 2026).

:::note Worked example: a receipt scanner with one prompt
A finance app lets users snap a receipt photo. The old pipeline (still common in 2023) needed:

- A specialized OCR model (Tesseract / Google Document AI).
- A custom field-extraction model trained on receipts.
- Glue code to post-process and validate.

The 2026 version is one prompt:

```typescript
const result = await generateObject({
  model: anthropic('claude-sonnet-4-5'),
  schema: z.object({
    merchant: z.string(),
    date: z.string(),
    total: z.number(),
    currency: z.string().length(3),
    items: z.array(z.object({
      description: z.string(),
      amount: z.number(),
    })),
  }),
  messages: [{
    role: 'user',
    content: [
      { type: 'text', text: 'Extract the receipt fields.' },
      { type: 'image', image: receiptBuffer },
    ],
  }],
});
```

> **In English:** Combine structured output (the Zod schema for a receipt) with multimodal input (the receipt photo). The model returns a typed object with merchant, date, total, currency, and line items — already validated against the schema. No OCR step, no glue code.

Done. ~20 lines, no model training, no glue code, fully typed output. The dedicated OCR pipeline still wins on volume + cost at very large scale, but for most teams the multimodal LLM is a strictly better starting point.
:::

:::info Highlight: multimodal isn't free
Vision input is much more expensive than text input — a single image can cost 1,500+ tokens of input. Cost-control tips:

- **Resize before sending.** Most tasks don't need 4K resolution. Downscale to the longest model-recommended dimension.
- **Use the right model tier.** Haiku-class models handle most image tasks cheaply.
- **Cache aggressively.** Image analysis results often don't change; store them.
- **Reach for specialized models** (Whisper for transcription, dedicated OCR) when you're doing millions of operations.

Multimodal is a fantastic *prototype-quality* tool that scales further than people expect — but at high volume, you'll still benchmark it against specialized alternatives.
:::

## What's next

→ Continue to [AI Observability](./ai-observability) — production AI requires its own logging and evaluation layer.
