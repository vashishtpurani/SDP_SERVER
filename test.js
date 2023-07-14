const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');

async function loadModel() {
    const model = await use.load();
    return model;
}

// Load the model
const modelPromise = loadModel();
async function calculateSimilarity(sentence1, sentence2) {
    const model = await modelPromise;

    const embeddings = await model.embed([sentence1, sentence2]);
    const embeddingsData = await embeddings.data();

    const diff = tf.sub(embeddingsData.slice(0, 512), embeddingsData.slice(512));
    const squaredDiff = tf.square(diff);
    const sumSquaredDiff = tf.sum(squaredDiff);
    const similarity = Math.sqrt(sumSquaredDiff.arraySync());
    const similarityPercentage = (1 - similarity) * 100;

    return similarityPercentage.toFixed(2);
}



// Example usage
const sentence1 = "can i drive my who whealer listening to music?";
const sentence2 = "can i drive my bike with headphones on?";

calculateSimilarity(sentence1, sentence2)
    .then(similarity => {
        console.log(`Similarity between "${sentence1}" and "${sentence2}": ${similarity}%`);
    })
    .catch(error => {
        console.error('Error calculating similarity:', error);
    });
