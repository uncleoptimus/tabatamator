export function calculateTotalWorkoutTime({
  intervalTime,
  restTime,
  setRestTime,
  targetIntervals,
  targetSets,
  warmupTime
}) {
  // const {
  //   intervalTime,
  //   restTime,
  //   setRestTime,
  //   targetIntervals,
  //   targetSets,
  //   warmupTime
  // } = workout;

  const setCompletionTime =
    targetIntervals * intervalTime + (targetIntervals - 1) * restTime;

  const totalSetRestTime = (targetSets - 1) * setRestTime;

  return targetSets * setCompletionTime + totalSetRestTime + warmupTime;
}
