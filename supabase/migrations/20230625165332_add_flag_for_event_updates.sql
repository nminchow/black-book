alter table events add column has_updated boolean not null default false;
alter table notifications add column event integer references events (id);
