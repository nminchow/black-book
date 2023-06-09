create table panels (
  id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  created_at timestamp with time zone DEFAULT now(),
  guild_id VARCHAR(255) not null,
  channel_id VARCHAR(255) not null,
  message_id VARCHAR(255) not null,
  constraint unique_guild_id unique (guild_id)
);
