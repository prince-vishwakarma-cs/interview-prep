export const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions
) => `You are an AI trained to generate technical interview questions and answers.

    Task:
    - Role: ${role}
    - Candidate Experience: ${experience} years
    - Focus Topics: ${topicsToFocus}
    - Write ${numberOfQuestions} interview questions.
    - For each question, generate a detailed but beginner-friendly answer.
    - If the answer needs a code example, add a small code block inside.
    - Keep formatting very clean.
    - Return a pure JSON array like:
    [
      {
        "question": "Question here?",
        "answer": "Answer here."
      },
      ...
    ]
    
    Important: Do NOT add any extra text. Only return valid JSON.
    `;

export const conceptExplainPrompt = (
  question
) => `You are an AI trained to generate explanations for a given interview question.

        Task:
        - Explain the following interview question and its concept in depth as if you're teaching a beginner developer.
        - Question: "${question}"
        - After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
        - If the explanation includes a code example, provide a small code block.
        - Keep the formatting very clean and clear.
        - Return the result as a valid JSON object in the following format:
        {
          "title": "Short title here",
          "explanation": "Explanation here."
        }
        
        Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
        `;

export const contextQuestionAnswerPrompt = (context, userQuestion) => `
You are an AI assistant trained to answer questions based strictly on the provided context.

Task:
- Use ONLY the information given in the context below to answer the user's question.
- Do NOT make assumptions or include any outside knowledge.
- Provide clear, accurate, and concise answers.
- If the context does not contain enough information, say: "The context does not provide enough information to answer this question."
- Format the answer as a valid JSON object like:
{
  "answer": "Answer here."
}

Context:
"""
${context}
"""

User Question:
"${userQuestion}"

Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
`;
