const processPeriods = (periods) => {
    const newArray = [ ...periods ];

    return newArray.map((period, i) => {
        if(i === 0) {
            return { ... period };
        }
        return {
            goals: period.goals - periods[i-1].goals,
            shots: period.shots - periods[i-1].shots,
            hits: period.hits - periods[i-1].hits,
            timeOnAttack: period.timeOnAttack - periods[i-1].timeOnAttack,
            passing: period.passing,
            faceoffWins: period.faceoffWins - periods[i-1].faceoffWins,
            penaltyMinutes: period.penaltyMinutes - periods[i-1].penaltyMinutes,
            powerplayGoals: period.powerplayGoals - periods[i-1].powerplayGoals,
            powerplayChances: period.powerplayChances - periods[i-1].powerplayChances,
            shorthandedGoals: period.shorthandedGoals - periods[i-1].shorthandedGoals,
            isOvertime: i == 3
        }
    })
}

module.exports = processPeriods;