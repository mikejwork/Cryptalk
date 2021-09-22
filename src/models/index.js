// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const MessageType = {
  "TEXT": "TEXT",
  "FILE": "FILE"
};

const SubChannelType = {
  "TEXT": "TEXT",
  "VOICE": "VOICE"
};

const RequestStatus = {
  "PENDING": "PENDING",
  "ACCEPTED": "ACCEPTED",
  "REJECTED": "REJECTED"
};

const RequestType = {
  "FRIEND_REQUEST": "FRIEND_REQUEST"
};

const { DirectMessage, Messages, SubChannel, Channel, RequestStorage, Friends, User, Friend } = initSchema(schema);

export {
  DirectMessage,
  Messages,
  SubChannel,
  Channel,
  RequestStorage,
  Friends,
  MessageType,
  SubChannelType,
  RequestStatus,
  RequestType,
  User,
  Friend
};