import type { INodeProperties } from 'n8n-workflow';

export const eventOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['event'],
			},
		},
		options: [
			{ name: 'Create', value: 'create', description: 'Add an event to calendar', action: 'Create an event' },
			{ name: 'Delete', value: 'delete', description: 'Delete an event', action: 'Delete an event' },
			{ name: 'Get', value: 'get', description: 'Retrieve an event', action: 'Get an event' },
			{ name: 'Get Many', value: 'getAll', description: 'Retrieve many events from a calendar', action: 'Get many events' },
			{ name: 'Update', value: 'update', description: 'Update an event', action: 'Update an event' },
		],
		default: 'create',
	},
];

export const eventFields: INodeProperties[] = [
	// Get Many
	{
		displayName: 'Calendar URL',
		name: 'calendarUrl',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['event'], operation: ['getAll', 'create', 'update'] } },
		default: '',
	},
	{
		displayName: 'Start Time',
		name: 'start',
		type: 'dateTime',
		required: true,
		displayOptions: { show: { resource: ['event'], operation: ['create', 'update'] } },
		default: '',
	},
	{
		displayName: 'End Time',
		name: 'end',
		type: 'dateTime',
		required: true,
		displayOptions: { show: { resource: ['event'], operation: ['create', 'update'] } },
		default: '',
	},
	{
		displayName: 'Summary',
		name: 'summary',
		type: 'string',
		displayOptions: { show: { resource: ['event'], operation: ['create', 'update'] } },
		default: '',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		displayOptions: { show: { resource: ['event'], operation: ['create', 'update'] } },
		default: '',
	},
	{
		displayName: 'Location',
		name: 'location',
		type: 'string',
		displayOptions: { show: { resource: ['event'], operation: ['create', 'update'] } },
		default: '',
	},
	{
		displayName: 'RRULE',
		name: 'rrule',
		type: 'string',
		displayOptions: { show: { resource: ['event'], operation: ['create', 'update'] } },
		default: '',
	},
	// Get/Delete/Update by ID
	{
		displayName: 'Event ID',
		name: 'eventId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['event'], operation: ['get', 'delete', 'update'] } },
		default: '',
	},
	// Get Many options
	{
		displayName: 'After (Start Time)',
		name: 'timeMin',
		type: 'dateTime',
		displayOptions: { show: { resource: ['event'], operation: ['getAll'] } },
		default: '',
	},
	{
		displayName: 'Before (End Time)',
		name: 'timeMax',
		type: 'dateTime',
		displayOptions: { show: { resource: ['event'], operation: ['getAll'] } },
		default: '',
	},
];
