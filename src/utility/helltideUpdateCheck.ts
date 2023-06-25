import { ClientAndCommands, dbWrapper } from "../bot";
import { EventType } from "../worldEvents/createListener";

export const helltideUpdateCheck = (client: ClientAndCommands, db: NonNullable<dbWrapper>) => {
  // 1. query for helltides that have not yet ended and we haven't already updated
  const { data, error } = db.from('events').select()
    .filter('time', 'gt', new Date().toISOString())
    .filter('type', 'eq', EventType.Helltide)
    .filter('has_updated', 'eq', false)


  // 2. see if we are in the same hour as the start time (add a minute to the start time and take away a minute from now to be safe)
  // 3. if we are not, flip the flag, create a new image, and update the events
};
