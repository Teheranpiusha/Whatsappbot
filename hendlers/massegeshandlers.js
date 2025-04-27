import { groq } from '../config.js';

export async function handleIncomingMessage(sock, msg) {
  const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
  if (!text) return;

  const chatCompletion = await groq.chat.completions.create({
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    messages: [{ role: 'user', content: text }],
    stream: false,
    temperature: 1,
    max_completion_tokens: 1024,
    top_p: 1,
  });

  await sock.sendMessage(msg.key.remoteJid, {
    text: chatCompletion.choices[0].message.content,
  });
}
