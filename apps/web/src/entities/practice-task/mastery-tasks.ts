/** The tasks a lesson's mastery counts: advanced-subtopic tasks stay out (SPEC §1.4). */
export function masteryTasks<Task extends { countsTowardMastery?: boolean }>(
  tasks: readonly Task[],
): Task[] {
  return tasks.filter((task) => task.countsTowardMastery !== false);
}
