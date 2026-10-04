export namespace MascotSceneTypes {
  /** Baked scene in `public/images/mascot` (built by docs/artifacts/change-170/mascot/pipeline). */
  export type Scene = "home-hero";

  export type Props = {
    scene: Scene;
    className?: string;
  };
}
