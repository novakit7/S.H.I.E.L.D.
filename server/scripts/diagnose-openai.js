try {
  const { openai, openaiConfig } = await import('../src/config/openai.config.js');
  const response = await openai.responses.create({
    model: openaiConfig.model,
    input: 'Reply with the single word: OK',
    max_output_tokens: 16,
  });

  console.log(JSON.stringify({
    ok: true,
    model: openaiConfig.model,
    responseId: response.id,
    outputReceived: Boolean(response.output_text?.trim()),
  }));
} catch (error) {
  console.error('OpenRouter diagnostic failed:', JSON.stringify({
    name: error?.name,
    status: error?.status,
    code: error?.code,
    type: error?.type || error?.error?.type,
    requestId: error?.request_id || error?.requestId,
    message: error?.message,
  }));
  process.exitCode = 1;
}
