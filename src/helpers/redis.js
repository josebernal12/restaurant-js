import { createClient } from 'redis';

export const client = createClient({
    password: 'zT1O2uxYtMx16JFzYTpnLHph6fRLqNfj',
    socket: {
        host: 'redis-14859.c85.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 14859
    }
});