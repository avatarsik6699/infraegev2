import type {
  DashboardData,
  DashboardRange,
  ResourcePoint,
  TrafficPoint,
} from "../../../contracts/index.js";
import type { ProjectConfig } from "../../core/config.js";

export type AvailabilitySnapshot = {
  availability: "up" | "down";
  version: string;
};

export type ResourceSnapshot = {
  cpu: number;
  memory: number;
  disk: number;
  series: ResourcePoint[];
  containers: DashboardData["containers"];
};

export type TrafficSnapshot = {
  visits: number;
  series: TrafficPoint[];
  funnel: DashboardData["funnel"];
};

export type RealtimeTrafficSnapshot = DashboardData["summary"]["realtime"];

export type JournalSnapshot = DashboardData["errors"];
export type Fail2banSnapshot = DashboardData["bans"];

export type DashboardReaders = {
  readAvailability(project: ProjectConfig): Promise<AvailabilitySnapshot>;
  readBeszel(
    project: ProjectConfig,
    range: DashboardRange,
  ): Promise<ResourceSnapshot>;
  readUmami(
    project: ProjectConfig,
    range: DashboardRange,
  ): Promise<TrafficSnapshot>;
  readUmamiRealtime(project: ProjectConfig): Promise<RealtimeTrafficSnapshot>;
  readJournal(project: ProjectConfig): Promise<JournalSnapshot>;
  readFail2ban(project: ProjectConfig): Promise<Fail2banSnapshot>;
};
