export const USER_CREATED = 'USER_CREATED' as const;

export type UserCreated = typeof USER_CREATED;

export type UserCreatedPayload = {
  id: string;
  name: string;
};

export type UserCreatedOutboxEvent = {
  [USER_CREATED]: UserCreatedPayload;
};
