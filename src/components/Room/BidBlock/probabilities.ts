function combinations(k: number, n: number) {
    if (k > n) return 0;
    return factorial(n) / (factorial(k) * factorial(n - k));
}

function factorial(n: number) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

export function calculateProbability(dices: Array<number>, otherDiceCount: number, targetNumber: number, targetValue: number) {
    const myTargetCount = dices.filter(d => d === targetValue || d === 1).length;
    const needed = Math.max(0, targetNumber - myTargetCount);

    if (!needed) return 100

    const diceProbability = targetValue === 1 ? 1/6 : 1/3
    let result = 0
    for (let i = needed; i <= otherDiceCount; i++) {
        result += combinations(i, otherDiceCount) * diceProbability**i * (1 - diceProbability)**(otherDiceCount - i)
    }

    return +(result*100).toFixed(2)
}