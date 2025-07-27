import { useState } from "react";
import { HfInference } from "@huggingface/inference";

export default function AiChat() {
  const [context, setContext] = useState(`
    OpenAI was founded in 2015 by Elon Musk, Sam Altman, and others.
    The company develops AI technologies including GPT models.
    GPT-4 was released in March 2023.
  `);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize HF Inference (store token in environment variables)
  const hf = new HfInference("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await hf.questionAnswering({
        model: "deepset/roberta-base-squad2",
        inputs: {
          question: question,
          context: context,
        },
      });
      setAnswer(result.answer);
      console.log(result);
    } catch (err) {
      console.error("Error getting answer:", err);
      setError("Failed to get answer. Please try again.");
      setAnswer("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Hugging Face QA System</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Knowledge Context:
        </label>
        <textarea
          className="w-full p-2 border rounded"
          rows="6"
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
            disabled={loading || !question.trim()}
          >
            {loading ? "Processing..." : "Ask"}
          </button>
        </div>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {answer && (
        <div className="bg-gray-50 p-4 rounded">
          <h2 className="font-bold mb-2">Answer:</h2>
          <p>{answer}</p>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <p>
          Using model: <code>deepset/roberta-base-squad2</code>
        </p>
        <p>Note: This makes API calls to Hugging Face's servers.</p>
      </div>
    </div>
  );
}
