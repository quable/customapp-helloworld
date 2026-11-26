import { QuableInstance } from '@prisma/client';
import { QuablePimClient } from '@quable/quable-pim-js';
import { RESOURCES_ID } from '../helper/constants';

class KeyValueService {

    public registerKeyValue = async (quableInstance: QuableInstance, value?: string) => {
        const { authToken, name } = quableInstance;
        const quablePIMClient = new QuablePimClient({ apiToken: authToken, instanceName: name });
        let keyValue;
        try {
            keyValue = await quablePIMClient.API.REST.KeyValue.get(RESOURCES_ID);
        } catch (error) {
            console.log(error);
        }
        const payload = {
            id: RESOURCES_ID,
            value: value ? value : keyValue ? keyValue.value : new Date().toISOString(),
            isProtected: false,
            isPublic: true,
        };
        if (!keyValue) {
            keyValue = await quablePIMClient.API.REST.KeyValue.create(payload);
        } else {
            keyValue = await quablePIMClient.API.REST.KeyValue.update(RESOURCES_ID, payload);
        }
        return keyValue;
    };

}

export const keyValueService = new KeyValueService();