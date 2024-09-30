
// AlgoRithm One ProductsBM25
// for searching products

const k1 = 1.5;
const b = 0.75;

// Helper function to calculate IDF
function idf(term, docs) {
  const docCount = docs.length;
  const containingDocs = docs.filter(doc => doc.name.toLowerCase().includes(term.toLowerCase())).length;
  return Math.log((docCount - containingDocs + 0.5) / (containingDocs + 0.5) + 1);
}

// Helper function to calculate term frequency in a document
function termFrequency(term, doc) {
  const termCount = doc.name.toLowerCase().split(" ").filter(word => word === term.toLowerCase()).length;
  return termCount;
}

// BM25 calculation for a single document
function bm25Score(query, doc, allDocs) {
  const queryTerms = query.toLowerCase().split(" ");
  const avgdl = allDocs.reduce((sum, d) => sum + d.name.split(" ").length, 0) / allDocs.length;
  const docLength = doc.name.split(" ").length;

  let score = 0;

  queryTerms.forEach(term => {
    const idfTerm = idf(term, allDocs);
    const freq = termFrequency(term, doc);

    score += idfTerm * ((freq * (k1 + 1)) / (freq + k1 * (1 - b + b * (docLength / avgdl))));
  });

  return score;
}

// Searching products using BM25
function searchProductsBM25(query, products) {
  const scores = products.map(product => {
    return {
      product,
      score: bm25Score(query, product, products)
    };
  });

  // Sort products by BM25 score in descending order
  scores.sort((a, b) => b.score - a.score);

  // Filter out products with a score of 0
  const filtered = scores.filter(s => s.score > 0).map(s => s.product);

  return filtered;
}




//Collaborative Filtering
export const calculateSimilarities = (ratings) => {
  const similarities = {};
  
  // Calculate similarity between users
  for (let userA in ratings) {
    similarities[userA] = {};
    for (let userB in ratings) {
      if (userA !== userB) {
        const commonItems = Object.keys(ratings[userA]).filter(item => ratings[userB][item] > 0);
        const numerator = commonItems.reduce((sum, item) => sum + (ratings[userA][item] * ratings[userB][item]), 0);
        const denominatorA = Math.sqrt(Object.keys(ratings[userA]).reduce((sum, item) => sum + Math.pow(ratings[userA][item], 2), 0));
        const denominatorB = Math.sqrt(Object.keys(ratings[userB]).reduce((sum, item) => sum + Math.pow(ratings[userB][item], 2), 0));
        
        const similarity = denominatorA && denominatorB ? numerator / (denominatorA * denominatorB) : 0;
        similarities[userA][userB] = similarity;
      }
    }
  }
  return similarities;
};

export const recommendProducts = (user, ratings, numRecommendations = 2) => {
  const similarities = calculateSimilarities(ratings);
  const userSimilarities = similarities[user];
  
  const weightedSums = {};
  const similaritySums = {};
  
  for (let otherUser in userSimilarities) {
    const similarity = userSimilarities[otherUser];
    for (let product in ratings[otherUser]) {
      if (ratings[otherUser][product] > 0 && !ratings[user][product]) {
        if (!weightedSums[product]) weightedSums[product] = 0;
        if (!similaritySums[product]) similaritySums[product] = 0;
        
        weightedSums[product] += ratings[otherUser][product] * similarity;
        similaritySums[product] += similarity;
      }
    }
  }
  
  const recommendations = Object.keys(weightedSums).map(product => ({
    product,
    score: weightedSums[product] / similaritySums[product],
  }));

  return recommendations.sort((a, b) => b.score - a.score).slice(0, numRecommendations);
};
