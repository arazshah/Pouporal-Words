const API_KEY = "2788174f-0760-4272-88cb-a173d6502189"; // Replace with your Merriam-Webster API key

let wordData = null;

// Fetch word data from Merriam-Webster API
async function fetchWordData(word) {
  const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${API_KEY}`;

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
    wordItem.innerHTML = `
      <h3>${data[0].meta.id}</h3>
      <p><strong>Definition:</strong> ${data[0].shortdef.join(", ")}</p>
      <p><strong>Part of Speech:</strong> ${data[0].fl}</p>
      <p><strong>Examples:</strong></p>
      <ul>
        ${data[0].shortdef.map((def) => `<li>${def}</li>`).join("")}
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
