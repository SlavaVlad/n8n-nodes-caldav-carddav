import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
// @ts-ignore
import SimpleCalDAV from 'simple-caldav';

// Получить CalDav client из credentials
export function getCalDavClient(this: IExecuteFunctions | ILoadOptionsFunctions) {
	const credentials = this.getCredentials('calDavBasicAuth') as any;
	if (!credentials) {
		throw new NodeApiError(this.getNode(), { message: 'No credentials returned!' });
	}
	const { serverUrl, username, password } = credentials;
	return new SimpleCalDAV(serverUrl, {
		headers: {
			Authorization: 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
		},
	});
}

// Получить список календарей (CalDav collection)
export async function getCalendars(this: ILoadOptionsFunctions) {
	const client = getCalDavClient.call(this);
	const calendars = await client.listCalendars();
	return {
		results: calendars.map((c: any) => ({ name: c.displayName || c.url, value: c.url })),
	};
}

// Получить события календаря за период
export async function getEvents(this: IExecuteFunctions, calendarUrl: string, timeMin: string, timeMax: string) {
	const client = getCalDavClient.call(this);
	return client.listEvents(calendarUrl, { start: new Date(timeMin), end: new Date(timeMax) });
}

// Создать событие
export async function createEvent(this: IExecuteFunctions, calendarUrl: string, event: IDataObject) {
	const client = getCalDavClient.call(this);
	return client.addEvent(calendarUrl, event);
}

// Обновить событие
export async function updateEvent(this: IExecuteFunctions, calendarUrl: string, eventId: string, event: IDataObject) {
	const client = getCalDavClient.call(this);
	return client.updateEvent(calendarUrl, eventId, event);
}

// Удалить событие
export async function deleteEvent(this: IExecuteFunctions, calendarUrl: string, eventId: string) {
	const client = getCalDavClient.call(this);
	return client.deleteEvent(calendarUrl, eventId);
}

// Преобразовать дату в ISO (CalDav совместимый формат)
export function dateObjectToISO<T>(date: T): string {
	if (!date) return '';
	return date as string;
}
