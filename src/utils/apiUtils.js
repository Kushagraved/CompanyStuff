const calculateScore = (performanceIndex) => {
  const score = performanceIndex.reduce((score, { key, value }) => {
    if (key === 'cpi') {
      score += (value) * 10;
    }
    else if (key === 'cf') {
      score += (value / 10000);
    }
    else if (key === 'mau') {
      score += (value * 10);
    }
    else {
      score += value;
    }
    return score;
  }, 0);

  return score;
};
module.exports = {
  calculateScore
};