import { useNavigate } from "react-router-dom";

const AssistantSelector = () => {
  const navigate = useNavigate();

  const selectAssistant = (assistant: string) => {
    navigate(`/chat?assistant=${assistant}`);
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold mb-4">Elige tu asistente</h1>
      <button
        onClick={() => selectAssistant("zenbot")}
        className="mb-2 p-4 bg-green-500 text-white rounded"
      >
        ZenBot 🧘‍♂️
      </button>
      <button
        onClick={() => selectAssistant("sadbot")}
        className="p-4 bg-blue-500 text-white rounded"
      >
        SadBot 😢
      </button>
    </div>
  );
};

export default AssistantSelector;
