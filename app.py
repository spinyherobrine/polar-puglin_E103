from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

# Load open-source model (small, safe, instruction-following)
summarizer = pipeline(
    "text2text-generation",
    model="google/flan-t5-base"
)

class RequestData(BaseModel):
    question: str
    context: str

@app.post("/explain")
def explain(data: RequestData):
    prompt = f"""
You are a website navigation assistant.
You can ONLY refer to the content below.
Do NOT assume anything.

CONTENT:
{context}

QUESTION:
{question}

TASK:
Explain what this section is for and how it helps the user navigate the site.

If the answer is not present, say: "I cannot find this information on the current page."

CONTENT:
{data.context}

QUESTION:
{data.question}

Explain in simple words.
"""

    result = summarizer(prompt, max_new_tokens=150)[0]["generated_text"]


    return {"answer": result}
