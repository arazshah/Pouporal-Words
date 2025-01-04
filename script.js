const API_KEY = "2788174f-0760-4272-88cb-a173d6502189"; // Replace with your Merriam-Webster API key

let wordData = null;

// Fetch word data from Merriam-Webster API
async function fetchWordData(word) {
  const url = `https://dictionaryapi.com/api/v3/references/learners/json/${word}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching word data:", error);
    return null;
  }
}

// Display word data
function displayWordData(data) {
  const wordList = document.getElementById("wordList");
  wordList.innerHTML = "";

  if (Array.isArray(data) && data.length > 0) {
    const wordItem = document.createElement("div");
    wordItem.className = "word-item";

    // Extract word details
    const word = data[0].meta.id;
    const partOfSpeech = data[0].fl;
    const definition = data[0].shortdef[0];
    const examples = data[0].def[0].sseq[0][0][1].dt
      .filter((item) => item[0] === "vis")
      .flatMap((item) => item[1].map((example) => example.t));

    wordItem.innerHTML = `
      <h3>${word}</h3>
      <p><strong>Part of Speech:</strong> ${partOfSpeech}</p>
      <p><strong>Definition:</strong> ${definition}</p>
      <p><strong>Examples:</strong></p>
      <ul>
        ${examples.map((example) => `<li>${example}</li>`).join("")}
      </ul>
    `;
    wordList.appendChild(wordItem);
  } else {
    wordList.innerHTML = "<p>No results found.</p>";
  }
}

// Handle form submission
document.getElementById("wordForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const word = document.getElementById("word").value.trim();

  if (word) {
    const data = await fetchWordData(word);
    wordData = data; // Save word data for download
    displayWordData(data);
  } else {
    alert("Please enter a word.");
  }
});

// Download JSON
document.getElementById("downloadBtn").addEventListener("click", () => {
  if (wordData) {
    const dataStr = JSON.stringify(wordData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${wordData[0].meta.id}_data.json`;
    a.click();
    URL.revokeObjectURL(url);
  } else {
    alert("No word data to download.");
  }
});
