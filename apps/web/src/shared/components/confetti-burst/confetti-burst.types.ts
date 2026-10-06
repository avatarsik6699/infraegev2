export namespace ConfettiBurstTypes {
  export type Props = {
    /** Plays the burst once when it becomes true; remount (`key`) to replay. */
    active: boolean;
    /** Positions the burst origin inside a positioned parent. */
    className?: string;
  };
}
