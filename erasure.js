// Given source and poem
const source =
  "a set of rules to live one’s life by. This was a need not met by ancient religion, which privileged ritual over doctrine and provided little in the way of moral and ethical guidelines. Nor did anyone expect it to. That was what philosophy was for. Philosophy in the modern sense is largely the creation of one man, the fifth-century B.C. Athenian thinker Socrates. But it is primarily in the Hellenistic period that we see the rise of philosophical sects, promulgating coherent “belief systems” that an individual could accept as a whole and which were designed to explain the world in its totality.";

const poem =
  "a set of rules to live by ancient religion, ritual over doctrine moral and ethical guidelines. That was what philosophy was, the creation of one Athenian thinker. The rise of philosophical belief systems, designed to explain the world in its totality.";

const strikeThrough = (source, poem) => {
  // go through each word in the poem and remove the first instance of it in the source
  // then remove it from the poem
  // when the poem is empty, return the new source
  // ignore punctuation
  const poemWords = poem.split(" ");
  const sourceWords = source.split(" ");

  // remove punctuation
  for (let i = 0; i < poemWords.length; i++) {
    poemWords[i] = poemWords[i].replace(/[“”!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "").toLowerCase();
  }

  for (let i = 0; i < sourceWords.length; i++) {
    sourceWords[i] = sourceWords[i].replace(/[“”!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "").toLowerCase();
  }
  let newSource = "";
  let sourceIndex = 0;
  for (let i = 0; i < sourceWords.length; i++) {
    if (sourceWords[i] === poemWords[sourceIndex]) {
        console.log("found a match at " + sourceWords[i] + " at index " + i + " and source index " + sourceIndex);
      sourceIndex++;
        newSource += sourceWords[i] + " ";
    } else {
      newSource += "||" + sourceWords[i] + "||" + " ";
    }
  }
  console.log(newSource);
  return newSource;
};

strikeThrough(source, poem);
