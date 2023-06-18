import { EventType } from "../worldEvents/createListener";
import fetch from "node-fetch";

type Response = {
  event: RawEventResponse
}

type ConfidenceObject = {
  [key: string]: number
}

export type RawEventResponse = {
  name: string,
  location: string,
  time: number,
  confidence: {
    name: ConfidenceObject,
    location: ConfidenceObject,
    time: ConfidenceObject,
  }
}

const simulateEvents = process.env.SIMULATE_EVENTS;

export const getEvents = async (eventType: string) => {
  if (simulateEvents) return simulatedEvents(eventType);
  const response = await fetch(`https://diablo4.life/api/trackers/${eventType}/list`);
  const { event } = await response.json() as Response;
  return event;
}

const simulatedEvents = (eventType: string) => {
  if (eventType !== EventType.WorldBoss) return { confidence: { name: {}, location: {}, time: {}} };
  const date = new Date();
  date.setMinutes(date.getMinutes() - 5)
  date.setMilliseconds(0);
  var dateWithOffset = new Date(date);

  return {
		name: "Ashava the Pestilent",
		time: dateWithOffset.getTime(),
		location: "Seared Basin - Kehjistan",
		confidence: {
			name: {
				"Ashava the Pestilent": 1
			},
			location: {
				"Seared Basin - Kehjistan": 0.96,
				"Saraan Caldera - Dry Steppes": 0.04
			},
			time: {
				"1687046520000": 0.08,
				"1687046460000": 0.92
			}
		}
	};
}