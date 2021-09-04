// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const RequestStatus = {
  "PENDING": "PENDING",
  "ACCEPTED": "ACCEPTED",
  "REJECTED": "REJECTED"
};

const RequestType = {
  "FRIEND_REQUEST": "FRIEND_REQUEST"
};

const { RequestStorage, Friends, Friend } = initSchema(schema);

export {
  RequestStorage,
  Friends,
  RequestStatus,
  RequestType,
  Friend
};