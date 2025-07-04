import type {
	IExecuteFunctions,
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import {
	getCalDavClient,
	getCalendars,
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
} from './GenericFunctions';

export class CalDavCalendar implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CalDav Calendar',
		name: 'calDavCalendar',
		icon: 'fa:calendar',
		group: ['input'],
		version: 1,
		description: 'Work with CalDav/CardDav servers (Baikal, SabreDAV, etc)',
		defaults: {
			name: 'CalDav Calendar',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'calDavBasicAuth-Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Calendar', value: 'calendar' },
					{ name: 'Event', value: 'event' },
				],
				default: 'event',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Get Many', value: 'getAll', description: 'Get events from calendar', action: 'Get many events' },
					{ name: 'Create', value: 'create', description: 'Create event', action: 'Create an event' },
					{ name: 'Update', value: 'update', description: 'Update event', action: 'Update an event' },
					{ name: 'Delete', value: 'delete', description: 'Delete event', action: 'Delete an event' },
				],
				default: 'getAll',
				displayOptions: { show: { resource: ['event'] } },
			},
			{
				displayName: 'Calendar URL',
				name: 'calendarUrl',
				type: 'string',
				required: true,
				description: 'URL of the calendar (DAV collection)',
				displayOptions: { show: { resource: ['event'] } },
				default: '',
			},
			{
				displayName: 'Event ID',
				name: 'eventId',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['event'], operation: ['update', 'delete'] } },
				default: '',
			},
			{
				displayName: 'Event Data',
				name: 'eventData',
				type: 'json',
				required: true,
				displayOptions: { show: { resource: ['event'], operation: ['create', 'update'] } },
				default: '{}',
			},
			{
				displayName: 'Start Time',
				name: 'timeMin',
				type: 'dateTime',
				required: true,
				displayOptions: { show: { resource: ['event'], operation: ['getAll'] } },
				default: '',
			},
			{
				displayName: 'End Time',
				name: 'timeMax',
				type: 'dateTime',
				required: true,
				displayOptions: { show: { resource: ['event'], operation: ['getAll'] } },
				default: '',
			},
		],
	};

	methods = {
		loadOptions: {
			async getCalendars(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const data = await getCalendars.call(this);
				return data.results;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;

		for (let i = 0; i < length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				if (resource === 'event') {
					const calendarUrl = this.getNodeParameter('calendarUrl', i) as string;
					if (operation === 'getAll') {
						const timeMin = this.getNodeParameter('timeMin', i) as string;
						const timeMax = this.getNodeParameter('timeMax', i) as string;
						const events = await getEvents.call(this, calendarUrl, timeMin, timeMax);
						returnData.push({ json: events });
					} else if (operation === 'create') {
						const eventData = this.getNodeParameter('eventData', i) as IDataObject;
						const result = await createEvent.call(this, calendarUrl, eventData);
						returnData.push({ json: result });
					} else if (operation === 'update') {
						const eventId = this.getNodeParameter('eventId', i) as string;
						const eventData = this.getNodeParameter('eventData', i) as IDataObject;
						const result = await updateEvent.call(this, calendarUrl, eventId, eventData);
						returnData.push({ json: result });
					} else if (operation === 'delete') {
						const eventId = this.getNodeParameter('eventId', i) as string;
						const result = await deleteEvent.call(this, calendarUrl, eventId);
						returnData.push({ json: result });
					}
				}
				if (resource === 'calendar') {
					const client = getCalDavClient.call(this);
					if (!client) throw new NodeOperationError(this.getNode(), 'No credentials found');
					const calendars = await client.listCalendars();
					returnData.push({ json: calendars.map((c: any) => ({ name: c.displayName || c.url, value: c.url })) });
				}
			} catch (error) {
				if (!this.continueOnFail()) {
					throw error;
				} else {
					returnData.push({ json: { error: error.message } });
					continue;
				}
			}
		}
		return [returnData];
	}
}

export default CalDavCalendar;
