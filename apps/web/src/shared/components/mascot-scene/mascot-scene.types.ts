export namespace MascotSceneTypes {
  /** Baked scene in `public/images/mascot` (built by scripts/mascot). */
  export type Scene =
    | "home-hero"
    | "sign-in"
    | "register"
    | "not-found"
    | "error"
    | "empty-search";

  export type Props = {
    scene: Scene;
    className?: string;
  };
}
