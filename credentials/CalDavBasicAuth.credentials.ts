/* eslint-disable n8n-nodes-base/cred-class-name-unsuffixed */
/* eslint-disable n8n-nodes-base/cred-class-field-display-name-missing-api */
/* eslint-disable n8n-nodes-base/cred-class-field-name-unsuffixed */

import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CalDavBasicAuth implements ICredentialType {
	name = 'calDavBasicAuth';
	displayName = 'CalDAV Basic Auth';
	properties: INodeProperties[] = [
		{
			displayName: 'Server URL',
			name: 'serverUrl',
			type: 'string',
			default: 'https://calendar.com/calendars/username/canendarname/',
		},
        {
            displayName: 'Username',
            name: 'username',
            type: 'string',
            default: 'username@email.com',
        },
        {
            displayName: 'Password',
            name: 'password',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
        },
	];
}
