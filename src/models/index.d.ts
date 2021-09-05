import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum RequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED"
}

export enum RequestType {
  FRIEND_REQUEST = "FRIEND_REQUEST"
}

export declare class Friend {
  readonly sub: string;
  readonly username: string;
  constructor(init: ModelInit<Friend>);
}

type RequestStorageMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type FriendsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
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