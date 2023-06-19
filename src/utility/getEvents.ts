import { EventType } from "../worldEvents/createListener";
import fetch from "node-fetch";

type ConfidenceObject = {
  [key: string]: number
}

export type RawEventResponse = {
  boss: {
    name: string,
    expectedName: string,
    nextExpectedName: string,
    timestamp: number,
    expected: number,
    nextExpected: number,
    territory: string,
    zone: string,
  }
  helltide: {
    timestamp: number,
    zone: string,
    refresh: number,
  },
  legion: {
    timestamp: number
    territory: string,
    zone: string,
  }
}

const simulateEvents = process.env.SIMULATE_EVENTS;

export const getEvents = async () => {
  if (simulateEvents) return simulatedEvents();
  const response = await fetch(`https://d4armory.io/api/events/recent`);
  const event  = await response.json() as RawEventResponse;
  return event;
}

const simulatedEvents = () => {
  // if (eventType !== EventType.WorldBoss) return { confidence: { name: {}, location: {}, time: {}} };
  // const date = new Date();
  // date.setMinutes(date.getMinutes() - 5)
  // date.setMilliseconds(0);
  // var dateWithOffset = new Date(date);

  // return {
  // 	name: "Ashava the Pestilent",
  // 	time: dateWithOffset.getTime(),
  // 	location: "Seared Basin - Kehjistan",
  // 	confidence: {
  // 		name: {
  // 			"Ashava the Pestilent": 1
  // 		},
  // 		location: {
  // 			"Seared Basin - Kehjistan": 0.96,
  // 			"Saraan Caldera - Dry Steppes": 0.04
  // 		},
  // 		time: {
  // 			"1687046520000": 0.08,
  // 			"1687046460000": 0.92
  // 		}
  // 	}
  // };
  return {
    "boss": {
      "name": "Avarice",
      "expectedName": "Avarice",
      "nextExpectedName": "Ashava",
      "timestamp": 1687199600,
      "expected": 1687198689,
      "nextExpected": 1687218202,
      "territory": "Saraan Caldera",
      "zone": "Dry Steppes"
    },
    "helltide": { "timestamp": 1687190400, "zone": "hawe", "refresh": 0 },
    "legion": { "timestamp": 1687194461, "territory": "Dilapidated Aqueducts", "zone": "Kehjistan" }
  };
};