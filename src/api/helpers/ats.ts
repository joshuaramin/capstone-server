import axios from "axios";
import pdf from "pdf-parse";
import natural from "natural";

async function extractTextFromPdf(pdfUrl: string): Promise<string> {
  const response = await axios.get(pdfUrl, { responseType: "arraybuffer" });
  const data = await pdf(response.data);
  return data.text;
}

function preprocessText(text: string): string[] {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text.toLowerCase());

  const stopwords = new Set(natural.stopwords);
  const filteredTokens = tokens.filter((token) => !stopwords.has(token));

  return filteredTokens;
}

function matchJobDescription(
  resumeText: string,
  jobDescription: string
): number {
  const resumeTokens = preprocessText(resumeText);
  const jobTokens = preprocessText(jobDescription);

  const allTokens = Array.from(new Set([...resumeTokens, ...jobTokens]));

  const resumeVector = allTokens.map(
    (token) => resumeTokens.filter((t) => t === token).length
  );
  const jobVector = allTokens.map(
    (token) => jobTokens.filter((t) => t === token).length
  );

  const dotProduct = resumeVector.reduce(
    (acc, val, i) => acc + val * jobVector[i],
    0
  );
  const resumeMagnitude = Math.sqrt(
    resumeVector.reduce((acc, val) => acc + val * val, 0)
  );
  const jobMagnitude = Math.sqrt(
    jobVector.reduce((acc, val) => acc + val * val, 0)
  );

  const cosineSimilarity = dotProduct / (resumeMagnitude * jobMagnitude);
  return cosineSimilarity * 100; // Return match percentage
}
export async function ATSMainFunc(pdfUrl, jobDescription) {
  try {
    const resume = await extractTextFromPdf(pdfUrl);
    const matchPercentage = await matchJobDescription(resume, jobDescription);

    return matchPercentage;
  } catch (e) {
    console.error(e);
  }
}
