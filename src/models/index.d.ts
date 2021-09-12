import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum MessageType {
  TEXT = "TEXT",
  FILE = "FILE"
}

export enum SubChannelType {
  TEXT = "TEXT",
  VOICE = "VOICE"
}

export enum RequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED"
}

export enum RequestType {
  FRIEND_REQUEST = "FRIEND_REQUEST"
}

export declare class User {
  readonly username: string;
  readonly sub: string;
  constructor(init: ModelInit<User>);
}

export declare class Friend {
  readonly sub: string;
  readonly username: string;
  constructor(init: ModelInit<Friend>);
}

type MessagesMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type SubChannelMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ChannelMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type RequestStorageMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type FriendsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Messages {
  readonly id: string;
  readonly author_username: string;
  readonly author_id: string;
  readonly type: MessageType | keyof typeof MessageType;
  readonly content_link?: string;
  readonly subchannelID?: string;
  readonly content: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Messages, MessagesMetaData>);
  static copyOf(source: Messages, mutator: (draft: MutableModel<Messages, MessagesMetaData>) => MutableModel<Messages, MessagesMetaData> | void): Messages;
}

export declare class SubChannel {
  readonly id: string;
  readonly name: string;
  readonly type: SubChannelType | keyof typeof SubChannelType;
  readonly users?: User[];
  readonly channelID?: string;
  readonly messages?: (Messages | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<SubChannel, SubChannelMetaData>);
  static copyOf(source: SubChannel, mutator: (draft: MutableModel<SubChannel, SubChannelMetaData>) => MutableModel<SubChannel, SubChannelMetaData> | void): SubChannel;
}

export declare class Channel {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly users?: User[];
  readonly sub_channels?: (SubChannel | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Channel, ChannelMetaData>);
  static copyOf(source: Channel, mutator: (draft: MutableModel<Channel, ChannelMetaData>) => MutableModel<Channel, ChannelMetaData> | void): Channel;
}

export declare class RequestStorage {
  readonly id: string;
  readonly sender_sub: string;
  readonly reciever_sub: string;
  readonly type: RequestType | keyof typeof RequestType;
  readonly status: RequestStatus | keyof typeof RequestStatus;
  readonly sender_username: string;
  readonly reciever_username: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<RequestStorage, RequestStorageMetaData>);
  static copyOf(source: RequestStorage, mutator: (draft: MutableModel<RequestStorage, RequestStorageMetaData>) => MutableModel<RequestStorage, RequestStorageMetaData> | void): RequestStorage;
}

export declare class Friends {
  readonly id: string;
  readonly owner?: string;
  readonly list?: Friend[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Friends, FriendsMetaData>);
  static copyOf(source: Friends, mutator: (draft: MutableModel<Friends, FriendsMetaData>) => MutableModel<Friends, FriendsMetaData> | void): Friends;
}