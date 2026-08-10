import type { DashboardReaders } from "../modules/dashboard/schemas.js";
import { readAvailability } from "./availability.js";
import { readBeszel } from "./beszel.js";
import { readFail2ban } from "./fail2ban.js";
import { readJournal } from "./journal.js";
import { readUmami } from "./umami.js";

export function createLiveReaders(): DashboardReaders {
  return {
    readAvailability,
    readBeszel,
    readUmami,
    readJournal,
    readFail2ban,
  };
}
