import { render, screen } from "@testing-library/react";
import { StrictMode } from "react";
import { describe, expect, it } from "vitest";
import {
  RevealFade,
  RevealGroup,
  RevealSwap,
  TimelineTypewriter,
  TypeLines,
} from "@/components/AnimatedComponents";

describe("RevealFade", () => {
  it("renders its children", () => {
    render(<RevealFade>hello</RevealFade>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });
});

describe("RevealGroup", () => {
  it("renders every direct child", async () => {
    render(
      <RevealGroup className="gap-2">
        <div>alpha</div>
        <div>beta</div>
        <div>gamma</div>
      </RevealGroup>,
    );
    expect(await screen.findByText("alpha")).toBeInTheDocument();
    expect(screen.getByText("beta")).toBeInTheDocument();
    expect(screen.getByText("gamma")).toBeInTheDocument();
  });

  it("renders children statically when instant", () => {
    render(
      <RevealGroup instant>
        <div>now</div>
      </RevealGroup>,
    );
    expect(screen.getByText("now")).toBeInTheDocument();
  });
});

describe("TypeLines", () => {
  it("eventually reveals every line", async () => {
    render(
      <TypeLines
        lineMs={1}
        lines={[
          <span key="a">one</span>,
          <span key="b">two</span>,
          <span key="c">three</span>,
        ]}
      />,
    );
    expect(await screen.findByText("one")).toBeInTheDocument();
    expect(await screen.findByText("three")).toBeInTheDocument();
  });

  // Regression: under React Strict Mode (Next dev default) effects run
  // mount → cleanup → mount. The typewriter must re-subscribe its interval on
  // the second run, otherwise content stays empty.
  it("reveals every line under React Strict Mode (effect double-invoke)", async () => {
    render(
      <StrictMode>
        <TypeLines
          lineMs={1}
          lines={[<span key="a">alpha</span>, <span key="b">omega</span>]}
        />
      </StrictMode>,
    );
    expect(await screen.findByText("omega")).toBeInTheDocument();
  });
});

describe("TimelineTypewriter", () => {
  it("reveals entries line-by-line, including bullets", async () => {
    render(
      <TimelineTypewriter
        lineMs={1}
        entries={[
          {
            key: "a",
            lines: [<p key="p">period-a</p>, <p key="n">name-a</p>],
            bullets: ["bullet-a1", "bullet-a2"],
          },
          { key: "b", lines: [<p key="p">period-b</p>] },
        ]}
      />,
    );
    expect(await screen.findByText("period-a")).toBeInTheDocument();
    expect(await screen.findByText("bullet-a2")).toBeInTheDocument();
    expect(await screen.findByText("period-b")).toBeInTheDocument();
  });

  it("reveals all lines under React Strict Mode", async () => {
    render(
      <StrictMode>
        <TimelineTypewriter
          lineMs={1}
          entries={[
            { key: "a", lines: [<p key="p">solo</p>], bullets: ["b1"] },
          ]}
        />
      </StrictMode>,
    );
    expect(await screen.findByText("solo")).toBeInTheDocument();
    expect(await screen.findByText("b1")).toBeInTheDocument();
  });
});

describe("RevealSwap", () => {
  it("shows the skeleton while loading", () => {
    render(
      <RevealSwap loading skeleton={<div>loading…</div>}>
        <div>ready</div>
      </RevealSwap>,
    );
    expect(screen.getByText("loading…")).toBeInTheDocument();
    expect(screen.queryByText("ready")).toBeNull();
  });

  it("shows the content when not loading", async () => {
    render(
      <RevealSwap loading={false} skeleton={<div>loading…</div>}>
        <div>ready</div>
      </RevealSwap>,
    );
    expect(await screen.findByText("ready")).toBeInTheDocument();
  });
});
