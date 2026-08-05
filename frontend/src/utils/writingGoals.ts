export interface WritingGoal {
  target: number;
  current: number;
}

export const getGoal = (): WritingGoal => {
  const goal = localStorage.getItem("writing-goal");
  return goal
    ? JSON.parse(goal)
    : { target: 1000, current: 0 };
};

export const saveGoal = (goal: WritingGoal) => {
  localStorage.setItem(
    "writing-goal",
    JSON.stringify(goal)
  );
};

export const calculateProgress = (
  current: number,
  target: number
) => {
  if (target === 0) return 0;
  return Math.min(
    Math.round((current / target) * 100),
    100
  );
};