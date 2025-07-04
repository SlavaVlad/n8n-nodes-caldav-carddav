import {
	ILoadOptionsFunctions,
	IExecuteFunctions
} from 'n8n-workflow';

import {
    DAVCalendar,
    DAVClient,
    DAVAddressBook,
} from 'tsdav';

import {
    parseICS,
} from 'node-ical';

export async function getClient(
    this: ILoadOptionsFunctions | IExecuteFunctions,
    accountType: 'caldav' | 'carddav',
) {
    const credentials = await this.getCredentials('calDavBasicAuth');
    const client = new DAVClient({
        serverUrl: credentials.serverUrl as string,
        credentials: {
          username: credentials.username as string,
          password: credentials.password as string,
        },
        authMethod: 'Basic',
        defaultAccountType: accountType,
    });
    await client.login();
    return client;
}

export async function getAddressBooks(
    this: ILoadOptionsFunctions | IExecuteFunctions,
    client?: DAVClient,
) {
    if (!client) {
        client = await getClient.call(this, 'carddav');
    }
    const addressBooks = await client.fetchAddressBooks();
    return addressBooks;
}

export async function getContacts(
    this: IExecuteFunctions,
    addressBookName: string,
) {
    const client = await getClient.call(this, 'carddav');
    const addressBooks = await getAddressBooks.call(this, client);
    const addressBook = addressBooks.find((book) => book.displayName === addressBookName);
    if (!addressBook) {
        return [];
    }
    const contacts = await client.fetchVCards({ addressBook: addressBook as DAVAddressBook });
    return contacts;
}

export async function getCalendars(
    this: ILoadOptionsFunctions | IExecuteFunctions,
    client?: DAVClient,
) {
    if (!client) {
        client = await getClient.call(this, 'caldav');
    }
    const calendars = await client.fetchCalendars();
    return calendars;
}

export async function getEvents(
    this: IExecuteFunctions,
    calendarName: string,
    start: string,
    end: string,
) {
    const client = await getClient.call(this, 'caldav');
    const calendars = await getCalendars.call(this, client);
    const calendar = calendars.find((calendar) => calendar.displayName === calendarName);
    if (!calendar) {
        return [];
    }
    const events = await client.fetchCalendarObjects({
        calendar: calendar as DAVCalendar,
        timeRange: {
            start: start,
            end: end,
        },
        expand: true
    });
    const eventResults = [];
    for (const event of events) {
        const eventData = parseICS(event.data);
        for (const key in eventData) {
            if (key != 'vcalendar') {
                const data = eventData[key] as any;
                eventResults.push({
                    url: event.url,
                    etag: event.etag,
                    ...data
                });
            }
        }
    }
    return eventResults.sort((a, b) => {
        if (a?.start < b?.start) {
            return -1;
        } else if (a?.start > b?.start) {
            return 1;
        } else {
            return 0;
        }
    });
}
