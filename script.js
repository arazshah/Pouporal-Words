let words = JSON.parse(localStorage.getItem('words')) || [];

document.getElementById('wordForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const word = document.getElementById('word').value;
  const sentences = document.getElementById('sentences').value.split(',');
  const reading_example = document.getElementById('reading_example').value;
  const quote = document.getElementById('quote').value;
  const synonyms = document.getElementById('synonyms').value.split(',');
  const antonyms = document.getElementById('antonyms').value.split(',');

  const newWord = {
    word,
    sentences,
    reading_example,
    quote,
    synonyms,
    antonyms,
  };

  words.push(newWord);
  localStorage.setItem('words', JSON.stringify(words));
  alert('Word added successfully');
  loadWords();
});

function loadWords() {
  const wordList = document.getElementById('wordList');
  wordList.innerHTML = '';

  words.forEach((word) => {
    const wordItem = document.createElement('div');
    wordItem.className = 'word-item';
    wordItem.innerHTML = `
      <h3>${word.word}</h3>
      <p><strong>Reading Example:</strong> ${word.reading_example}</p>
      <p><strong>Quote:</strong> ${word.quote}</p>
      <p><strong>Synonyms:</strong> ${word.synonyms.join(', ')}</p>
      <p><strong>Antonyms:</strong> ${word.antonyms.join(', ')}</p>
      <div>
        <strong>Sentences:</strong>
        ${word.sentences
          .map(
            (sentence) => `
          <div class="sentence-item">
            ${sentence}
            <button class="btn btn-info btn-sm" onclick="speak('${sentence}')">Listen</button>
          </div>
        `
          )
          .join('')}
      </div>
    `;
    wordList.appendChild(wordItem);
  });
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

document.getElementById('downloadBtn').addEventListener('click', () => {
  const dataStr = JSON.stringify(words, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'words.json';
  a.click();
  URL.revokeObjectURL(url);
});

// Load words when the page loads
loadWords();
