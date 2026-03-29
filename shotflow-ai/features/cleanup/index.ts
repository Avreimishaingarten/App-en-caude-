import { CleanupSession, MediaGroup } from '../../types';
import { deleteAssets } from '../../lib/media';

export interface CleanupPlan {
  groups: MediaGroup[];
  totalItemsToDelete: number;
  totalItemsToKeep: number;
  estimatedSavingsBytes: number;
  deleteIds: string[];
  keepIds: string[];
}

export function buildCleanupPlan(
  groups: MediaGroup[],
  overrides?: Map<string, string>, // groupId -> keepId overrides
): CleanupPlan {
  const deleteIds: string[] = [];
  const keepIds: string[] = [];

  for (const group of groups) {
    const keepId = overrides?.get(group.id) ?? group.recommendedKeepId;

    for (const item of group.items) {
      if (item.id === keepId) {
        keepIds.push(item.id);
      } else {
        deleteIds.push(item.id);
      }
    }
  }

  const estimatedSavingsBytes = groups.reduce((sum, g) => {
    const keepId = overrides?.get(g.id) ?? g.recommendedKeepId;
    return sum + g.items
      .filter((i) => i.id !== keepId)
      .reduce((s, i) => s + i.fileSize, 0);
  }, 0);

  return {
    groups,
    totalItemsToDelete: deleteIds.length,
    totalItemsToKeep: keepIds.length,
    estimatedSavingsBytes,
    deleteIds,
    keepIds,
  };
}

export async function executeCleanup(plan: CleanupPlan): Promise<CleanupSession> {
  const session: CleanupSession = {
    id: `cleanup_${Date.now()}`,
    scanSessionId: '',
    selectedForDeleteIds: plan.deleteIds,
    keptIds: plan.keepIds,
    estimatedSavedBytes: plan.estimatedSavingsBytes,
    startedAt: Date.now(),
  };

  const success = await deleteAssets(plan.deleteIds);

  if (success) {
    session.actualSavedBytes = plan.estimatedSavingsBytes;
  }
  session.completedAt = Date.now();

  return session;
}
