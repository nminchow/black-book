alter table subscriptions add constraint channel_server UNIQUE (channel_id, guild_id);
