export namespace ConfettiBurstTypes {
  export type Props = {
    /** Plays the burst once each time it turns true; showing it again does not replay. */
    active: boolean;
    /** Positions the burst origin inside a positioned parent. */
    className?: string;
  };
}
