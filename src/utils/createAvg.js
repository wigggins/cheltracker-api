const createAvg = (totalGames, totalStat) => {
    return +((totalStat / totalGames).toFixed(2));
};

module.exports = createAvg;