import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LessonVideo } from "~/shared/components/learning-content";

const props = {
  src: "/lesson-media/demo/clip",
  poster: "/lesson-media/demo/clip-poster.webp",
  width: 1600,
  height: 900,
  alt: "дерево вызовов",
  caption: "Одно и то же значение считается дважды.",
};

function stubReducedMotion(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: reduced && query.includes("prefers-reduced-motion"),
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }),
  });
}

type ObserverCallback = (entries: { isIntersecting: boolean }[]) => void;

class FakeIntersectionObserver {
  static callbacks: ObserverCallback[] = [];
  constructor(callback: ObserverCallback) {
    FakeIntersectionObserver.callbacks.push(callback);
  }
  observe() {}
  disconnect() {}
}

function setVisible(isIntersecting: boolean) {
  act(() => {
    for (const callback of FakeIntersectionObserver.callbacks) {
      callback([{ isIntersecting }]);
    }
  });
}

describe("LessonVideo", () => {
  let paused: boolean;
  let currentTime: number;
  const play = vi.fn();
  const pause = vi.fn();

  beforeEach(() => {
    paused = true;
    currentTime = 0;
    FakeIntersectionObserver.callbacks = [];
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    play.mockImplementation(function playFake(this: HTMLVideoElement) {
      paused = false;
      this.dispatchEvent(new Event("play"));
      return Promise.resolve();
    });
    pause.mockImplementation(function pauseFake(this: HTMLVideoElement) {
      paused = true;
      this.dispatchEvent(new Event("pause"));
    });
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(play);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(pause);
    vi.spyOn(HTMLMediaElement.prototype, "paused", "get").mockImplementation(
      () => paused,
    );
    vi.spyOn(HTMLMediaElement.prototype, "duration", "get").mockReturnValue(10);
    vi.spyOn(
      HTMLMediaElement.prototype,
      "currentTime",
      "get",
    ).mockImplementation(() => currentTime);
    vi.spyOn(
      HTMLMediaElement.prototype,
      "currentTime",
      "set",
    ).mockImplementation((value: number) => {
      currentTime = value;
    });
    stubReducedMotion(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    play.mockReset();
    pause.mockReset();
  });

  function markup() {
    return new DOMParser().parseFromString(
      renderToStaticMarkup(<LessonVideo {...props} />),
      "text/html",
    );
  }

  it("renders a silent looping video with both formats, poster and reserved size, but no autoplay", () => {
    const video = markup().querySelector("video")!;
    expect(video.getAttribute("poster")).toBe(props.poster);
    expect(video.getAttribute("width")).toBe("1600");
    expect(video.getAttribute("height")).toBe("900");
    for (const attr of ["loop", "muted", "playsinline"]) {
      expect(video.hasAttribute(attr), attr).toBe(true);
    }
    expect(video.hasAttribute("autoplay")).toBe(false);
    expect(
      [...video.querySelectorAll("source")].map((source) => [
        source.getAttribute("src"),
        source.getAttribute("type"),
      ]),
    ).toEqual([
      ["/lesson-media/demo/clip.webm", "video/webm"],
      ["/lesson-media/demo/clip.mp4", "video/mp4"],
    ]);
  });

  it("has exactly one caption and no service label", () => {
    const doc = markup();
    expect(doc.querySelectorAll("figcaption")).toHaveLength(1);
    expect(doc.querySelector("figcaption")?.textContent).toBe(props.caption);
    expect(doc.body.textContent).not.toContain("Текстовое описание");
  });

  it("keeps the controls inert and hidden without JavaScript", () => {
    const doc = markup();
    const controls = doc.querySelector("[data-lesson-video-controls]")!;
    expect(controls.getAttribute("data-enhanced")).toBe("false");
    expect(controls.querySelector("button")?.hasAttribute("disabled")).toBe(
      true,
    );
    expect(controls.querySelector("input")?.hasAttribute("disabled")).toBe(
      true,
    );
  });

  it("starts when half visible and pauses when it leaves the screen", () => {
    render(<LessonVideo {...props} />);
    expect(play).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Воспроизвести: дерево вызовов" }),
    ).toBeTruthy();
    setVisible(true);
    expect(play).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: "Пауза: дерево вызовов" }),
    ).toBeTruthy();
    setVisible(false);
    expect(pause).toHaveBeenCalledTimes(1);
  });

  it("respects an explicit pause when the video re-enters the screen", () => {
    render(<LessonVideo {...props} />);
    setVisible(true);
    fireEvent.click(
      screen.getByRole("button", { name: "Пауза: дерево вызовов" }),
    );
    expect(paused).toBe(true);
    setVisible(false);
    setVisible(true);
    expect(play).toHaveBeenCalledTimes(1);
    fireEvent.click(
      screen.getByRole("button", { name: "Воспроизвести: дерево вызовов" }),
    );
    expect(play).toHaveBeenCalledTimes(2);
    setVisible(false);
    setVisible(true);
    expect(play).toHaveBeenCalledTimes(3);
  });

  it("toggles when the picture is clicked", () => {
    const { container } = render(<LessonVideo {...props} />);
    setVisible(true);
    fireEvent.click(container.querySelector("video")!);
    expect(pause).toHaveBeenCalledTimes(1);
    fireEvent.click(container.querySelector("video")!);
    expect(play).toHaveBeenCalledTimes(2);
  });

  it("scrubs with the timeline without pausing and reports the position", () => {
    render(<LessonVideo {...props} />);
    setVisible(true);
    const timeline = screen.getByRole("slider", {
      name: "Положение в ролике: дерево вызовов",
    });
    fireEvent.change(timeline, { target: { value: "500" } });
    expect(currentTime).toBe(5);
    expect(timeline.getAttribute("aria-valuetext")).toBe("5 из 10 с");
    expect(pause).not.toHaveBeenCalled();
  });

  it("does not autoplay for reduced motion but lets the learner start it", () => {
    stubReducedMotion(true);
    render(<LessonVideo {...props} />);
    setVisible(true);
    expect(play).not.toHaveBeenCalled();
    fireEvent.click(
      screen.getByRole("button", { name: "Воспроизвести: дерево вызовов" }),
    );
    expect(play).toHaveBeenCalledTimes(1);
  });

  it("plays at once when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<LessonVideo {...props} />);
    expect(play).toHaveBeenCalledTimes(1);
  });
});
