import type { INodeProperties } from 'n8n-workflow';

export const calendarOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['calendar'],
			},
		},
		options: [
			{
				name: 'Availability',
				value: 'availability',
				description: 'If a time-slot is available in a calendar',
				action: 'Get availability in a calendar',
			},
		],
		default: 'availability',
	},
];

export const calendarFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                 calendar:availability                      */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Calendar',
		name: 'calendar',
		type: 'string',
		default: '',
		required: true,
		description: 'Google Calendar to operate on',
	},
	{
		displayName: 'Start Time',
		name: 'timeMin',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				operation: ['availability'],
				resource: ['calendar'],
				'@version': [{ _cnd: { lt: 1.3 } }],
			},
		},
		default: '',
		description: 'Start of the interval',
	},
	{
		displayName: 'End Time',
		name: 'timeMax',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				operation: ['availability'],
				resource: ['calendar'],
				'@version': [{ _cnd: { lt: 1.3 } }],
			},
		},
		default: '',
		description: 'End of the interval',
	},
	{
		displayName: 'Start Time',
		name: 'timeMin',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				operation: ['availability'],
				resource: ['calendar'],
				'@version': [{ _cnd: { gte: 1.3 } }],
			},
		},
		default: '={{ $now }}',
		description:
			'Start of the interval, use <a href="https://docs.n8n.io/code/cookbook/luxon/" target="_blank">expression</a> to set a date, or switch to fixed mode to choose date from widget',
	},
	{
		displayName: 'End Time',
		name: 'timeMax',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				operation: ['availability'],
				resource: ['calendar'],
				'@version': [{ _cnd: { gte: 1.3 } }],
			},
		},
		default: "={{ $now.plus(1, 'hour') }}",
		description:
			'End of the interval, use <a href="https://docs.n8n.io/code/cookbook/luxon/" target="_blank">expression</a> to set a date, or switch to fixed mode to choose date from widget',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add option',
		displayOptions: {
			show: {
				operation: ['availability'],
				resource: ['calendar'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Output Format',
				name: 'outputFormat',
				type: 'options',
				options: [
					{
						name: 'Availability',
						value: 'availability',
						description: 'Returns if there are any events in the given time or not',
					},
					{
						name: 'Booked Slots',
						value: 'bookedSlots',
						description: 'Returns the booked slots',
					},
					{
						name: 'RAW',
						value: 'raw',
						description: 'Returns the RAW data from the API',
					},
				],
				default: 'availability',
				description: 'The format to return the data in',
			},
			{
				displayName: 'Timezone',
				name: 'timezone',
				type: 'string',
				default: '',
				description: 'Time zone used in the response. By default n8n timezone is used.',
			},
		],
	},
];
