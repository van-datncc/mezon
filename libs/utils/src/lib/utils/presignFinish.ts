import type { ApiMessageAttachment } from 'mezon-js';
import { safeJSONParse } from 'mezon-js';
import { FOR_10_MINUTES_SEC } from '../constant';
import { isMezonCdnUrl } from './urlSanitization';

export const PRESIGN_PENDING_MAX_AGE_SEC = FOR_10_MINUTES_SEC;

export function getPresignKeyFromAttachmentUrl(url?: string): string | undefined {
	if (!url || url.startsWith('blob:')) return undefined;

	try {
		const pathname = new URL(url).pathname;
		const segment = pathname.split('/').filter(Boolean).pop();
		if (!segment) return undefined;
		return segment.replace(/\.[^/.]+$/, '');
	} catch {
		const segment = url.split('?')[0].split('/').filter(Boolean).pop();
		return segment?.replace(/\.[^/.]+$/, '');
	}
}

export function parsePresignFinishKeys(content: unknown): string[] | null {
	const parsed = typeof content === 'string' ? safeJSONParse(content) : content;
	if (!parsed || typeof parsed !== 'object') return null;
	if (!('presign_finish' in parsed)) return null;

	const keys = (parsed as { presign_finish?: unknown }).presign_finish;
	if (!Array.isArray(keys)) return null;

	return keys.filter((key): key is string => typeof key === 'string');
}

export function isPresignAttachmentPending(url: string | undefined, presignFinishKeys: string[] | null): boolean {
	if (presignFinishKeys === null || !url || !isMezonCdnUrl(url)) return false;

	const presignKey = getPresignKeyFromAttachmentUrl(url);
	if (!presignKey) return false;

	return !presignFinishKeys.includes(presignKey);
}

export function getPresignFinishFingerprint(content: unknown): string {
	const keys = parsePresignFinishKeys(content);
	return keys ? keys.join('\u0001') : '';
}

export function isExpiredPresignAttachment(
	url: string | undefined,
	presignFinishKeys: string[] | null,
	messageCreateTimeSeconds?: number,
	nowSeconds = Math.floor(Date.now() / 1000)
): boolean {
	if (!messageCreateTimeSeconds || presignFinishKeys === null) return false;
	if (!isPresignAttachmentPending(url, presignFinishKeys)) return false;
	return nowSeconds - messageCreateTimeSeconds >= PRESIGN_PENDING_MAX_AGE_SEC;
}

export function filterExpiredPresignAttachments(
	attachments: ApiMessageAttachment[],
	content: unknown,
	messageCreateTimeSeconds?: number,
	nowSeconds = Math.floor(Date.now() / 1000)
): ApiMessageAttachment[] {
	const presignFinishKeys = parsePresignFinishKeys(content);
	if (presignFinishKeys === null || !messageCreateTimeSeconds) return attachments;

	return attachments.filter(
		(attachment) => !isExpiredPresignAttachment(attachment.url, presignFinishKeys, messageCreateTimeSeconds, nowSeconds)
	);
}

export function hasActivePresignPendingAttachments(
	attachments: ApiMessageAttachment[] | undefined,
	content: unknown
): boolean {
	const presignFinishKeys = parsePresignFinishKeys(content);
	if (presignFinishKeys === null || !attachments?.length) return false;

	return attachments.some((attachment) => isPresignAttachmentPending(attachment.url, presignFinishKeys));
}
