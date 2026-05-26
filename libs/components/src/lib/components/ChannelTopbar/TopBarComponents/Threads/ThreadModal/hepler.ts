import type { ThreadsEntity } from '@mezon/store';
import { ThreadStatus } from '@mezon/utils';

export const filterThreadList = (threads: ThreadsEntity[]) =>
	threads.reduce(
		(acc, thread) => {
			if (thread.active === ThreadStatus.joined) {
				acc.listJoin.push(thread);
			} else if (thread.active === ThreadStatus.archived) {
				acc.listArchived.push(thread);
			} else {
				acc.listOther.push(thread);
			}

			return acc;
		},
		{
			listJoin: [] as ThreadsEntity[],
			listArchived: [] as ThreadsEntity[],
			listOther: [] as ThreadsEntity[]
		}
	);
