export namespace MascotSceneTypes {
  /** Baked scene in `public/images/mascot` (built by scripts/mascot). */
  export type Scene =
    | "home-hero"
    | "sign-in"
    | "register"
    | "not-found"
    | "error"
    | "empty-search"
    // Change 192: paid access
    | "paywall"
    | "paywall-guest"
    | "pricing"
    | "access-open";

  export type Props = {
    scene: Scene;
    className?: string;
  };
}
