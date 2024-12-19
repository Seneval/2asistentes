const OpenAI = require("openai");

exports.handler = async (event) => {
  const { message, assistant } = JSON.parse(event.body);

  const openai = new OpenAI({
    apiKey: process.env.VITE_OPENAI_API_KEY,
  });

  try {
    // Selecciona el ID del asistente
    const ASSISTANT_ID =
      assistant === "zenbot"
        ? "asst_1adywEubGRTDXE2j9vq4OcDM"
        : "asst_fV1fdSuQipHMoPYAHCpHlw8p";

    // Crea un nuevo thread
    const thread = await openai.beta.threads.create();
    const threadId = thread.id;

    // Envía el mensaje
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });

    // Ejecuta el asistente
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_ID,
    });

    // Polling hasta que el mensaje esté completo
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    while (runStatus.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    }

    // Recupera la respuesta del asistente
    const messages = await openai.beta.threads.messages.list(threadId);
    const lastMessage = messages.data[0];

    return {
      statusCode: 200,
      body: JSON.stringify({
        response: lastMessage.content[0].text.value,
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error processing the message" }),
    };
  }
};
