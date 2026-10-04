export namespace MascotSceneTypes {
  /** Baked scene in `public/images/mascot` (built by docs/artifacts/change-170/mascot/pipeline). */
  export type Scene = "home-hero" | "sign-in" | "register";

  export type Props = {
    scene: Scene;
    className?: string;
  };
}
