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

  const date = new Date();
  date.setMinutes(date.getMinutes() + 5)
  date.setMilliseconds(0);
  var dateWithOffset = new Date(date);
  const dateAsNum = Math.round(dateWithOffset.getTime() / 1000);
  return {
    "boss": {
      "name": "Avarice",
      "expectedName": "Avarice",
      "nextExpectedName": "Ashava",
      "timestamp": dateAsNum,
      "expected": 1687198689,
      "nextExpected": 1687218202,
      "territory": "Saraan Caldera",
      "zone": "Dry Steppes"
    },
    "helltide": { "timestamp": dateAsNum, "zone": "hawe", "refresh": 0 },
    "legion": { "timestamp": dateAsNum, "territory": "Dilapidated Aqueducts", "zone": "Kehjistan" }
  };
};