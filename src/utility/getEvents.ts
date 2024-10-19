import { EventType } from "../worldEvents/createListener";
import fetch from "node-fetch";

type ConfidenceObject = {
  [key: string]: number
}

export type RawEventResponse = {
  boss: {
    name: string,
    timestamp: number,
    territory?: string,
    zone?: string,
  }
  helltide: {
    timestamp: number,
    zone: string,
  },
  legion: {
    timestamp: number
    territory?: string,
    zone?: string,
  }
}

type WorldBossData = {
  e: string,
  n: string,
  ts: number,
  t?: string,
  z?: string
}

type HelltideData = {
  e: string,
  z: string,
}

type LegionData = {
  e: string,
  ts: number,
  t?: string,
  z?: string
}

type SimplifiedEventResponse = [WorldBossData, HelltideData, LegionData]

const simulateEvents = process.env.SIMULATE_EVENTS;

export const getEvents = async () => {
  if (simulateEvents) return simulatedEvents();
  try {
    const response = await fetch(`https://d4armory.io/api/events.json`);
    const simplifiedEvent  = await response.json() as SimplifiedEventResponse;
    const now = new Date();
    now.setMinutes(0, 0, 0);
    const event = {
      boss: {
        name: simplifiedEvent[0].n,
        timestamp: simplifiedEvent[0].ts,
        territory: simplifiedEvent[0].t,
        zone: simplifiedEvent[0].z
      },
      helltide: {
        zone: simplifiedEvent[1].z,
        timestamp: now.getTime() / 1000
      },
      legion: {
        timestamp: simplifiedEvent[2].ts,
        territory: simplifiedEvent[2].t,
        zone: simplifiedEvent[2].z,
      }
    }
    return event;
  } catch(error) {
    console.error('error fetching api data');
    console.error(error);
    return null;
  }
}

const simulatedEvents = () => {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  const date = new Date();
  date.setMinutes(date.getMinutes() + 5);
  date.setMilliseconds(0);
  var dateWithOffset = new Date(date);
  const dateAsNum = Math.round(dateWithOffset.getTime() / 1000);

  const helltideDate = new Date();
  // helltideDate.setMinutes(helltideDate.getMinutes() - 1.1);
  helltideDate.setMinutes(helltideDate.getMinutes() -50);
  helltideDate.setSeconds(0);
  helltideDate.setMilliseconds(0);
  const helltideDateWithOffset = new Date(helltideDate);
  const helltideDateAsNum = Math.round(helltideDateWithOffset.getTime() / 1000);

  return {
    boss: {
      name: 'boss man',
      timestamp: 0,
      territory: undefined,
      zone: undefined
    },
    helltide: {
      zone: 'somewhere',
      timestamp: now.getTime() / 1000
    },
    legion: {
      timestamp: 0,
      territory: undefined,
      zone: undefined,
    }
  };
};