import { useState, useEffect, useCallback } from "react";
import { LogicalSize, WebviewWindow, appWindow } from "@tauri-apps/api/window";
import { emit } from "@tauri-apps/api/event";
import { confirm } from "@tauri-apps/api/dialog";
let Ovrl;
const Resize = async (w, h) =>
  await Ovrl?.setSize(new LogicalSize(w, h)).then(async () => {
    let y = Math.round(Math.min(w / 1920, h / 1080) * 100) / 100;
    await emit("Editor", { type: "scale", Data: y });
  });
const NewWindow = async (w, h) => {
  Ovrl = new WebviewWindow("ovrl", {
    width: w,
    height: h,
    title: "Overlay",
    resizable: false,
    transparent: true,
    decorations: false,
    x: 0,
    y: 0,
    url: "/overlay",
    focus: false,
  });
  Resize(w, h);
  Ovrl.once("tauri://created", () => {
    Ovrl.setDecorations(true);
  });
};

appWindow.onCloseRequested(async (e) => {
  console.log(e);
  if (e.windowLabel === "ovrl") {
    appWindow.close();
  }
  await confirm("Are you sure you want to Exit the editor?", {
    title: "Confirm Exit",
    type: "warning",
  }).then((f) => {
    if (!f) {
      // user did not confirm closing the window; let's prevent it
      e.preventDefault();
      return;
    }
    Ovrl?.close();
    appWindow.close();
  });
});

const TIMEOUTS = {
  timeouts: [],
  setTimeout: function (fn, delay) {
    const id = setTimeout(fn, delay);
    this.timeouts.push(id);
  },
  clearAllTimeouts: function () {
    while (this.timeouts.length) {
      clearTimeout(this.timeouts.pop());
    }
  },
};

const deleteByIndex = (func, index, INout) => {
  emit("Editor", { type: "Green" });
  func((oldValues) => {
    const j = oldValues.filter((_, i) => i !== index);
    INout({ In: j[0]?.Name, Out: j[0]?.Name });
    return j;
  });
};
const editByIndex = (func, data, index, val) => {
  const newState = data.map((obj, i) => {
    if (i == index) {
      return { ...obj, Name: val };
    }
    return obj;
  });
  func(newState);
};

const ResetCardData = (func, func2, data, data2) => {
  const newState = data.map((obj) => {
    return { ...obj, Scored: false, Red: false, Yellow: false };
  });
  func(newState);
  const newState2 = data2.map((obj) => {
    return { ...obj, Scored: false, Red: false, Yellow: false };
  });
  func2(newState2);
};

const RedByIndex = (func, func2, data, data2, index, bol) => {
  emit("Editor", { type: "Green" });
  const newState = data.map((obj, i) => {
    if (i == index) {
      return { ...obj, Red: bol, Yellow: false, Scored: false };
    }
    return { ...obj, Scored: false, Red: false, Yellow: false };
  });
  func(newState);
  const newState2 = data2.map((obj) => {
    return { ...obj, Scored: false, Red: false, Yellow: false };
  });
  func2(newState2);
};
const YellowByIndex = (func, func2, data, data2, index, bol) => {
  emit("Editor", { type: "Green" });
  const newState = data.map((obj, i) => {
    if (i == index) {
      return { ...obj, Yellow: bol, Red: false, Scored: false };
    }
    return { ...obj, Scored: false, Red: false, Yellow: false };
  });
  func(newState);
  const newState2 = data2.map((obj) => {
    return { ...obj, Scored: false, Red: false, Yellow: false };
  });
  func2(newState2);
};
const ScoredByIndex = (func, func2, data, data2, index, bol) => {
  emit("Editor", { type: "Green" });
  const newState = data.map((obj, i) => {
    if (i == index) {
      return { ...obj, Scored: bol, Red: false, Yellow: false };
    }
    return { ...obj, Scored: false, Red: false, Yellow: false };
  });
  func(newState);
  const newState2 = data2.map((obj) => {
    return { ...obj, Scored: false, Red: false, Yellow: false };
  });
  func2(newState2);
};

const FEdit = () => {
  const [timer, setTimer] = useState(5000);
  const [time, setTime] = useState({ start: 0, stop: 0 });
  const [pressed, setPressed] = useState(true);
  const [pressed2, setPressed2] = useState(true);
  const [pressed3, setPressed3] = useState(false);
  const [pressed4, setPressed4] = useState(true);
  const [Players1, setPlayers1] = useState([]);
  const [Players2, setPlayers2] = useState([]);
  const [InOut, setInOut] = useState({ In: "", Out: "" });
  const [wndow, setwndow] = useState({ Width: 640, Height: 360 });
  const [MPlayer1, setMPlayer1] = useState("");
  const [MPlayer2, setMPlayer2] = useState("");
  const [Penalty1, setPenalty1] = useState([
    "#727372",
    "#727372",
    "#727372",
    "#727372",
    "#727372",
  ]);
  const [Penalty2, setPenalty2] = useState([
    "#727372",
    "#727372",
    "#727372",
    "#727372",
    "#727372",
  ]);
  const [Name1, setName1] = useState("Team1");
  const [Name2, setName2] = useState("Team2");
  const [Score1, setScore1] = useState(0);
  const [Score2, setScore2] = useState(0);
  const [selected, setSelected] = useState(Name1);
  const showFile = useCallback(
    async (e, d) => {
      e.preventDefault();
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        const lines = text.split("\n");
        lines.forEach((line) => {
          if (line != "") {
            if (d == 1) {
              setPlayers1((Player) => [
                ...Player,
                {
                  Name: line,
                  Yellow: false,
                  Red: false,
                  Scored: false,
                },
              ]);
            } else if (d == 2) {
              setPlayers2((Player) => [
                ...Player,
                {
                  Name: line,
                  Yellow: false,
                  Red: false,
                  Scored: false,
                },
              ]);
            }
          }
        });
        d == 1 ? setSelected(Name1) : setSelected(Name2);
        setInOut({ In: lines[0], Out: lines[0] });
      };
      reader.readAsText(e.target.files[0]);
    },
    [setPlayers1, Players1, setPlayers2, Players2, setSelected, Name1, Name2]
  );
  const data = {
    timer,
    time,
    InOut,
    wndow,
    MPlayer1,
    MPlayer2,
    Players1,
    Players2,
    Name1,
    Name2,
    Score1,
    Score2,
    selected,
    Penalty1,
    Penalty2,
  };
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("EditorData"));
    if (storedData) {
      setTimer(storedData.timer);
      setTime(storedData.time);
      setInOut(storedData.InOut);
      setwndow(storedData.wndow);
      setMPlayer1(storedData.MPlayer1);
      setMPlayer2(storedData.MPlayer2);
      setPlayers1(storedData.Players1);
      setPlayers2(storedData.Players2);
      setName1(storedData.Name1);
      setName2(storedData.Name2);
      setScore1(storedData.Score1);
      setScore2(storedData.Score2);
      setSelected(storedData.selected);
      setPenalty1(storedData.Penalty1);
      setPenalty2(storedData.Penalty2);
    }
    emit("Editor", { type: "Green" });
    emit("Editor", {
      type: "TData",
      Players1: Players1,
      Players2: Players2,
      Name1: Name1,
      Name2: Name2,
      Score1: Score1,
      Score2: Score2,
      Penalty1: Penalty1,
      Penalty2: Penalty2,
    });
    emit("Editor", {
      type: "PShow",
      Data: false,
    });
    emit("Editor", { type: "reset", Data: time });
    emit("Editor", { type: "THide" });
  }, []);

  useEffect(() => {
    localStorage.setItem("EditorData", JSON.stringify(data));
  }, [data]);
  return (
    <main className="min-h-screen text-xl grid place-items-center w-full bg-zinc-900">
      <div className="max-w-3xl w-full min-h-[16rem]">
        <div className="bg-blue-50 border-4 w-full flex">
          <h1 className=" text-3xl p-4 w-full">Editor</h1>
          <div className="text-xl flex">
            <button
              onClick={() => {
                NewWindow(1920, 1080);
                TIMEOUTS.clearAllTimeouts();
                TIMEOUTS.setTimeout(() => {
                  emit("Editor", {
                    type: "TData",
                    Players1: Players1,
                    Players2: Players2,
                    Name1: Name1,
                    Name2: Name2,
                    Score1: Score1,
                    Score2: Score2,
                    Penalty1: Penalty1,
                    Penalty2: Penalty2,
                  });
                }, 1500);
              }}
              className="border-l-2 p-3 bg-yellow-100 text-3xl"
            >
              HD
            </button>
            <button
              onClick={() => {
                NewWindow(1280, 720);
                TIMEOUTS.clearAllTimeouts();
                TIMEOUTS.setTimeout(() => {
                  emit("Editor", {
                    type: "TData",
                    Players1: Players1,
                    Players2: Players2,
                    Name1: Name1,
                    Name2: Name2,
                    Score1: Score1,
                    Score2: Score2,
                    Penalty1: Penalty1,
                    Penalty2: Penalty2,
                  });
                }, 1500);
              }}
              className="border-l-2 p-3 bg-neutral-100"
            >
              720p
            </button>
            {/* <div className="text-xs border-l-2 bg-green-100 flex w-full flex-col">
              <label className="px-3 py-2 flex">
                <span>Width</span>
                <input
                  type="number"
                  value={wndow.Width}
                  onChange={(e) =>
                    setwndow((o) => ({ ...o, Width: e.target.value }))
                  }
                  className="inline-block ml-3 w-20 outline-none text-center"
                />
              </label>
              <label className="px-3 py-2 flex border-t-2">
                <span>Hight</span>
                <input
                  type="number"
                  value={wndow.Height}
                  onChange={(e) =>
                    setwndow((o) => ({ ...o, Height: e.target.value }))
                  }
                  className="inline-block ml-3 w-20 outline-none text-center"
                />
              </label>
            </div>
            <button
              onClick={async () => {
                NewWindow(Number(wndow.Width), Number(wndow.Height));
                TIMEOUTS.clearAllTimeouts();
                TIMEOUTS.setTimeout(() => {
                  emit("Editor", {
                    type: "TData",
                    Players1: Players1,
                    Players2: Players2,
                    Name1: Name1,
                    Name2: Name2,
                    Score1: Score1,
                    Score2: Score2,
                    Penalty1: Penalty1,
                    Penalty2: Penalty2,
                  });
                }, 1500);
              }}
              className="border-l-2 bg-green-100 px-10"
            >
              +
            </button> */}
            <button
              onClick={async () =>
                await confirm("Are you sure you want Reset All Data?", {
                  title: "Confirm Data Reset",
                  type: "warning",
                }).then(
                  (e) =>
                    e && (localStorage.clear(), window.location.reload(false))
                )
              }
              className="border-l-2 bg-red-200 px-10"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="grid text-center md:grid-cols-2">
          <div>
            <div className="flex border-2 border-t-4 bg-red-50">
              <div className="w-6/12 border-x-2">
                <span className="block border-b-2 p-2">Starting Time</span>
                <input
                  onChange={(e) =>
                    setTime((Time) => ({ ...Time, start: e.target.value }))
                  }
                  type="number"
                  value={time.start}
                  className="p-4 text-center w-full bg-inherit text-4xl"
                />
                {pressed ? (
                  <button
                    onClick={() => {
                      setPressed(false);
                      emit("Editor", { type: "start", Data: time });
                    }}
                    className="block w-full border-t-2 p-2"
                  >
                    Start
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setPressed(true);
                      emit("Editor", { type: "pause" });
                    }}
                    className="block w-full border-t-2 p-2"
                  >
                    Stop
                  </button>
                )}
              </div>
              <div className="w-6/12">
                <span className="block border-b-2 p-2">Stoping Time</span>
                <input
                  onChange={(e) =>
                    setTime((Time) => ({ ...Time, stop: e.target.value }))
                  }
                  type="number"
                  value={time.stop}
                  className="p-4 text-center w-full bg-inherit text-4xl"
                />
                <button
                  onClick={() => {
                    emit("Editor", { type: "reset", Data: time });
                  }}
                  className="block w-full border-t-2 p-2"
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="w-full flex border-2 bg-blue-50">
              <div className="w-6/12 border-x-2">
                <h3 className="block border-b-2 p-1 min-h-[2.89rem] overflow-x-scroll">
                  {Name1}
                </h3>
                <span className="block border-b-2 p-4 text-4xl">{Score1}</span>
                <div className="p-1">
                  <button
                    onClick={() => {
                      setScore1(Score1 - 1);
                      emit("Editor", { type: "Score1", Data: Score1 - 1 });
                    }}
                    className="inline-block w-6/12 border-r-2"
                  >
                    -
                  </button>
                  <button
                    onClick={() => {
                      setScore1(Score1 + 1);
                      emit("Editor", { type: "Score1", Data: Score1 + 1 });
                    }}
                    className="inline-block w-6/12"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="w-6/12">
                <h3 className="block border-b-2 p-1 overflow-x-scroll min-h-[2.89rem]">
                  {Name2}
                </h3>
                <span className="block border-b-2 p-4 text-4xl">{Score2}</span>
                <div className="p-1">
                  <button
                    onClick={() => {
                      setScore2(Score2 - 1);
                      emit("Editor", { type: "Score2", Data: Score2 - 1 });
                    }}
                    className="inline-block w-6/12 border-r-2"
                  >
                    -
                  </button>
                  <button
                    onClick={() => {
                      setScore2(Score2 + 1);
                      emit("Editor", { type: "Score2", Data: Score2 + 1 });
                    }}
                    className="inline-block w-6/12"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-full bg-green-50 border-4 border-b-2 border-l-2">
            <h1 className="p-2 border-b-2">In & Out</h1>
            <div className="flex w-full">
              <ul className="border-r-2 w-fit">
                <li className="text-3xl p-[1.14rem] border-b-2">Team</li>
                <li className="text-3xl p-7 border-b-2">In</li>
                <li className="text-3xl p-[1.10rem] border-b-2">Out</li>
              </ul>
              <ul className="grid place-items-center w-full">
                <li className="text-lg w-full py-[0.53rem] border-b-2">
                  <select
                    onChange={(e) => {
                      let h = e.target.value;
                      if (h == Name1) {
                        setSelected(Name1);
                        setInOut({
                          In: Players1[0]?.Name,
                          Out: Players1[0]?.Name,
                        });
                      } else if (h == Name2) {
                        setSelected(Name2);
                        setInOut({
                          In: Players1[0]?.Name,
                          Out: Players1[0]?.Name,
                        });
                      }
                    }}
                    className="p-2 w-10/12 h-14"
                  >
                    {selected == Name1 ? (
                      <>
                        <option selected>{Name1}</option>
                        <option>{Name2}</option>
                      </>
                    ) : (
                      <>
                        <option>{Name1}</option>
                        <option selected>{Name2}</option>
                      </>
                    )}
                  </select>
                </li>
                <li className="text-lg py-[1.1rem] border-b-2 w-full">
                  <select
                    onChange={(e) =>
                      setInOut((obj) => ({ ...obj, In: e.target.value }))
                    }
                    className="p-2 w-10/12 h-14"
                  >
                    {selected == Name1 && (
                      <>
                        {!!Players1.length && (
                          <>
                            {Players1.map((e, i) => {
                              if (i == 0) {
                                return <option>{e.Name}</option>;
                              }
                              return <option>{e.Name}</option>;
                            })}
                          </>
                        )}
                      </>
                    )}
                    {selected == Name2 && (
                      <>
                        {!!Players2.length && (
                          <>
                            {Players2.map((e, i) => {
                              if (!i) {
                                return (
                                  <option selected={true}>{e.Name}</option>
                                );
                              }
                              return <option>{e.Name}</option>;
                            })}
                          </>
                        )}
                      </>
                    )}
                  </select>
                </li>
                <li className="text-lg py-[0.98rem] border-b-2 w-full">
                  <select
                    onChange={(e) =>
                      setInOut((obj) => ({ ...obj, Out: e.target.value }))
                    }
                    className="w-10/12 p-1 h-10"
                  >
                    {selected == Name1 && (
                      <>
                        {Players1.map((e, i) => {
                          if (!i) {
                            return <option selected>{e.Name}</option>;
                          }
                          return <option>{e.Name}</option>;
                        })}
                      </>
                    )}
                    {selected == Name2 && (
                      <>
                        {Players2.map((e, i) => {
                          if (!i) {
                            return <option selected>{e.Name}</option>;
                          }
                          return <option>{e.Name}</option>;
                        })}
                      </>
                    )}
                  </select>
                </li>
              </ul>
            </div>
            {pressed3 ? (
              <button
                onClick={() => {
                  setPressed3(false);
                  emit("Editor", { type: "Green" });
                }}
                className="p-1 bg-red-100 w-full"
              >
                Hide
              </button>
            ) : (
              <button
                onClick={() => {
                  setPressed3(true);
                  ResetCardData(setPlayers1, setPlayers2, Players1, Players2);
                  emit("Editor", { type: "Green" });
                  emit("Editor", {
                    type: "InOut",
                    Data: { ...InOut, show: true },
                  });
                  TIMEOUTS.clearAllTimeouts();
                  TIMEOUTS.setTimeout(() => {
                    setPressed3(false);
                    emit("Editor", { type: "Green" });
                  }, timer);
                }}
                className="p-1 w-full"
              >
                Show
              </button>
            )}
          </div>
        </div>
        <div className="grid md:grid-cols-2 border-x-4 border-t-2 bg-amber-50">
          <button
            onClick={() => {
              if (Players1.length > Players2.length) {
                let h = [...Array(Players2.length - Players1.length).keys()];
                const temp = [...Players2, ...h.map(() => " ")];
                setPlayers2(temp);
                emit("Editor", {
                  type: "TData",
                  Players1: Players1,
                  Players2: temp,
                  Name1: Name1,
                  Name2: Name2,
                  Score1: Score1,
                  Score2: Score2,
                  Penalty1: Penalty1,
                  Penalty2: Penalty2,
                });
              } else if (Players2.length > Players1.length) {
                let h = [...Array(Players2.length - Players1.length).keys()];
                const temp = [...Players1, ...h.map(() => " ")];
                setPlayers1(temp);
                emit("Editor", {
                  type: "TData",
                  Players1: temp,
                  Players2: Players2,
                  Name1: Name1,
                  Name2: Name2,
                  Score1: Score1,
                  Score2: Score2,
                  Penalty1: Penalty1,
                  Penalty2: Penalty2,
                });
              } else {
                emit("Editor", {
                  type: "TData",
                  Players1: Players1,
                  Players2: Players2,
                  Name1: Name1,
                  Name2: Name2,
                  Score1: Score1,
                  Score2: Score2,
                  Penalty1: Penalty1,
                  Penalty2: Penalty2,
                });
              }
            }}
            className="inline-block border-b-2 md:border-b-0 border-r-[1px] p-2"
          >
            Save
          </button>
          {!pressed2 ? (
            <button
              onClick={() => {
                setPressed2(true);
                emit("Editor", { type: "THide" });
              }}
              className="inline-block bg-yellow-100 p-2 border-l-[1px]"
            >
              Hide
            </button>
          ) : (
            <button
              onClick={() => {
                setPressed2(false);
                emit("Editor", { type: "TShow" });
              }}
              className="inline-block border-l-[1px] p-2"
            >
              Show
            </button>
          )}
        </div>
        <div className="grid bg-orange-50 md:grid-cols-2 border-4 border-t-2">
          <div className="border-r-[1px]">
            <input
              value={Name1}
              onChange={(e) => setName1(e.target.value)}
              className="w-full text-center border-b-2 bg-transparent p-3 text-3xl"
            />
            <label className="p-2 border-b-2 block text-center">
              <span>{"< -- Text File -- >"}</span>
              <input
                onChange={(e) => {
                  showFile(e, 1);
                }}
                type="file"
                className="sr-only"
              />
            </label>
            <label className="flex w-full border-b-2">
              <h1 className="w-2/12 px-[1.7rem] border-r-2 bg-orange-200">.</h1>
              <input
                onChange={(e) => setMPlayer1(e.target.value)}
                value={MPlayer1}
                className="w-8/12 p-1 text-center text-black"
                type="text"
              />
              <button
                onClick={() => {
                  emit("Editor", { type: "Green" });
                  setPressed3(false);
                  setPlayers1((d) => {
                    if (!d.length) {
                      setInOut({ In: MPlayer1, Out: MPlayer1 });
                    } else {
                      setInOut({ In: d[0].Name, Out: d[0].Name });
                    }
                    return [
                      ...d,
                      {
                        Name: MPlayer1,
                        Yellow: false,
                        Red: false,
                        Scored: false,
                      },
                    ];
                  });
                  setSelected(Name1);
                  setMPlayer1("");
                }}
                className="block bg-green-300 border-l-2 w-2/12"
              >
                +
              </button>
            </label>
            <ul>
              {Players1.map((e, i) => {
                return (
                  <li
                    className="odd:bg-lime-50 flex border-stone-600 border-b-2"
                    key={i}
                  >
                    <span className="w-2/12 p-4 text-center odd:bg-orange-100 bg-orange-200 border-r-2 inline-block">
                      {i}
                    </span>
                    <input
                      value={e.Name}
                      onChange={(h) =>
                        editByIndex(setPlayers1, Players1, i, h.target.value)
                      }
                      type="text"
                      className="w-8/12 px-4 py-1 bg-inherit text-center"
                    />
                    <div className="w-2/12 grid grid-cols-2">
                      {e.Scored ? (
                        <button
                          onClick={() => {
                            ScoredByIndex(
                              setPlayers1,
                              setPlayers2,
                              Players1,
                              Players2,
                              i,
                              false
                            );
                            emit("Editor", { type: "Green" });
                          }}
                          className="px-1 bg-neutral-500 text-sm"
                        >
                          ⚽
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setPressed3(false);
                            ScoredByIndex(
                              setPlayers1,
                              setPlayers2,
                              Players1,
                              Players2,
                              i,
                              true
                            );
                            emit("Editor", {
                              type: "Scorred",
                              Name: e.Name,
                              Team: Name1,
                            });
                            TIMEOUTS.clearAllTimeouts();
                            TIMEOUTS.setTimeout(() => {
                              if (!e.Scored) {
                                ScoredByIndex(
                                  setPlayers1,
                                  setPlayers2,
                                  Players1,
                                  Players2,
                                  i,
                                  false
                                );
                                emit("Editor", { type: "Green" });
                              }
                            }, timer);
                          }}
                          className="px-1 bg-neutral-300 text-sm"
                        >
                          ⚽
                        </button>
                      )}
                      <button
                        onClick={() => (
                          setSelected(Name1),
                          deleteByIndex(setPlayers1, i, setInOut)
                        )}
                        className="p-x1 bg-red-300 text-xl"
                      >
                        -
                      </button>
                      {e.Red ? (
                        <button
                          onClick={() => {
                            RedByIndex(
                              setPlayers1,
                              setPlayers2,
                              Players1,
                              Players2,
                              i,
                              false
                            );
                            emit("Editor", { type: "Green" });
                          }}
                          className="px-1 bg-red-800"
                        >
                          ⠀
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setPressed3(false);
                            RedByIndex(
                              setPlayers1,
                              setPlayers2,
                              Players1,
                              Players2,
                              i,
                              true
                            );
                            emit("Editor", {
                              type: "Red",
                              Name: e.Name,
                              Team: Name1,
                            });
                            TIMEOUTS.clearAllTimeouts();
                            TIMEOUTS.setTimeout(() => {
                              if (!e.Red) {
                                RedByIndex(
                                  setPlayers1,
                                  setPlayers2,
                                  Players1,
                                  Players2,
                                  i,
                                  false
                                );
                                emit("Editor", { type: "Green" });
                              }
                            }, timer);
                          }}
                          className="px-1 bg-red-500"
                        >
                          ⠀
                        </button>
                      )}
                      {e.Yellow ? (
                        <button
                          onClick={() => {
                            YellowByIndex(
                              setPlayers1,
                              setPlayers2,
                              Players1,
                              Players2,
                              i,
                              false
                            );
                            emit("Editor", { type: "Green" });
                          }}
                          className="px-1 bg-yellow-400"
                        >
                          ⠀
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setPressed3(false);
                            YellowByIndex(
                              setPlayers1,
                              setPlayers2,
                              Players1,
                              Players2,
                              i,
                              true
                            );
                            emit("Editor", {
                              type: "Yellow",
                              Name: e.Name,
                              Team: Name1,
                            });
                            TIMEOUTS.clearAllTimeouts();
                            TIMEOUTS.setTimeout(() => {
                              if (!e.Scored) {
                                YellowByIndex(
                                  setPlayers1,
                                  setPlayers2,
                                  Players1,
                                  Players2,
                                  i,
                                  false
                                );
                                emit("Editor", { type: "Green" });
                              }
                            }, timer);
                          }}
                          className="px-1 bg-yellow-200"
                        >
                          ⠀
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="border-l-[1px]">
            <input
              value={Name2}
              onChange={(e) => setName2(e.target.value)}
              className="w-full text-center border-b-2 bg-transparent p-3 text-3xl"
            />
            <label className="p-2 border-b-2 block text-center">
              <span>{"< -- Text File -- >"}</span>
              <input
                onChange={(e) => {
                  showFile(e, 2);
                }}
                type="file"
                className="sr-only"
              />
            </label>
            <label className="flex w-full border-b-2">
              <h1 className="w-2/12 px-[1.7rem] border-r-2 bg-orange-200">.</h1>
              <input
                onChange={(e) => setMPlayer2(e.target.value)}
                value={MPlayer2}
                className="w-8/12 p-1 text-center text-black"
                type="text"
              />
              <button
                onClick={() => {
                  emit("Editor", { type: "Green" });
                  setPressed3(false);
                  setPlayers2((d) => {
                    if (!d.length) {
                      setInOut({ In: MPlayer2, Out: MPlayer2 });
                    } else {
                      setInOut({ In: d[0].Name, Out: d[0].Name });
                    }
                    return [
                      ...d,
                      {
                        Name: MPlayer2,
                        Yellow: false,
                        Red: false,
                        Scored: false,
                      },
                    ];
                  });
                  setSelected(Name2);
                  setMPlayer2("");
                }}
                className="block bg-green-300 border-l-2 w-2/12"
              >
                +
              </button>
            </label>
            <ul>
              {Players2.map((e, i) => {
                return (
                  <li
                    className="odd:bg-lime-50 flex border-stone-600 border-b-2"
                    key={i}
                  >
                    <span className="w-2/12 p-4 text-center odd:bg-orange-100 bg-orange-200 border-r-2 inline-block">
                      {i}
                    </span>
                    <input
                      value={e.Name}
                      onChange={(h) =>
                        editByIndex(setPlayers2, Players2, i, h.target.value)
                      }
                      type="text"
                      className="w-8/12 px-4 py-1 bg-inherit text-center"
                    />
                    <div className="w-2/12 grid grid-cols-2">
                      {e.Scored ? (
                        <button
                          onClick={() => {
                            ScoredByIndex(
                              setPlayers2,
                              setPlayers1,
                              Players2,
                              Players1,
                              i,
                              false
                            );
                            emit("Editor", { type: "Green" });
                          }}
                          className="px-1 bg-neutral-500 text-sm"
                        >
                          ⚽
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setPressed3(false);
                            ScoredByIndex(
                              setPlayers2,
                              setPlayers1,
                              Players2,
                              Players1,
                              i,
                              true
                            );
                            emit("Editor", {
                              type: "Scorred",
                              Name: e.Name,
                              Team: Name2,
                            });
                            TIMEOUTS.clearAllTimeouts();
                            TIMEOUTS.setTimeout(() => {
                              if (!e.Scored) {
                                ScoredByIndex(
                                  setPlayers2,
                                  setPlayers1,
                                  Players2,
                                  Players1,
                                  i,
                                  false
                                );
                                emit("Editor", { type: "Green" });
                              }
                            }, timer);
                          }}
                          className="px-1 bg-neutral-300 text-sm"
                        >
                          ⚽
                        </button>
                      )}
                      <button
                        onClick={() => (
                          setSelected(Name2),
                          deleteByIndex(setPlayers2, i, setInOut)
                        )}
                        className="p-x1 bg-red-300 text-xl"
                      >
                        -
                      </button>
                      {e.Red ? (
                        <button
                          onClick={() => {
                            RedByIndex(
                              setPlayers2,
                              setPlayers1,
                              Players2,
                              Players1,
                              i,
                              false
                            );
                            emit("Editor", { type: "Green" });
                          }}
                          className="px-1 bg-red-800"
                        >
                          ⠀
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setPressed3(false);
                            RedByIndex(
                              setPlayers2,
                              setPlayers1,
                              Players2,
                              Players1,
                              i,
                              true
                            );
                            emit("Editor", {
                              type: "Red",
                              Name: e.Name,
                              Team: Name2,
                            });
                            TIMEOUTS.clearAllTimeouts();
                            TIMEOUTS.setTimeout(() => {
                              if (!e.Red) {
                                RedByIndex(
                                  setPlayers2,
                                  setPlayers1,
                                  Players2,
                                  Players1,
                                  i,
                                  false
                                );
                                emit("Editor", { type: "Green" });
                              }
                            }, timer);
                          }}
                          className="px-1 bg-red-500"
                        >
                          ⠀
                        </button>
                      )}
                      {e.Yellow ? (
                        <button
                          onClick={() => {
                            YellowByIndex(
                              setPlayers2,
                              setPlayers1,
                              Players2,
                              Players1,
                              i,
                              false
                            );
                            emit("Editor", { type: "Green" });
                          }}
                          className="px-1 bg-yellow-400"
                        >
                          ⠀
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setPressed3(false);
                            YellowByIndex(
                              setPlayers2,
                              setPlayers1,
                              Players2,
                              Players1,
                              i,
                              true
                            );
                            emit("Editor", {
                              type: "Yellow",
                              Name: e.Name,
                              Team: Name2,
                            });
                            TIMEOUTS.clearAllTimeouts();
                            TIMEOUTS.setTimeout(() => {
                              if (!e.Scored) {
                                YellowByIndex(
                                  setPlayers2,
                                  setPlayers1,
                                  Players2,
                                  Players1,
                                  i,
                                  false
                                );
                                emit("Editor", { type: "Green" });
                              }
                            }, timer);
                          }}
                          className="px-1 bg-yellow-200"
                        >
                          ⠀
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="bg-slate-200 w-full text-center">
          <h1 className="text-4xl py-3 border-x-4">Penalty</h1>
          <div className="grid border-x-4 border-t-2">
            {!pressed4 ? (
              <button
                onClick={() => {
                  setPressed4(true);
                  emit("Editor", { type: "PShow", Data: false });
                }}
                className="inline-block bg-yellow-100 p-2 border-l-[1px]"
              >
                Hide
              </button>
            ) : (
              <button
                onClick={() => {
                  setPressed4(false);
                  emit("Editor", { type: "PShow", Data: true });
                }}
                className="inline-block border-l-[1px] p-2"
              >
                Show
              </button>
            )}
          </div>
          <div className="grid md:grid-cols-2 border-x-4 border-y-2 border-b-4">
            <div className="flex flex-col">
              <div className="grid h-full grid-cols-5 border-l-[1px]">
                {Penalty1.map((f, i) => (
                  <button
                    className="h-10 border-2 border-white w-full rounded-md"
                    style={{ backgroundColor: f }}
                    onClick={() => {
                      f === "#727372" &&
                        setPenalty1((g) => {
                          let d = g.map((v, h) => (i === h ? "#4fe04f" : v));
                          emit("Editor", {
                            type: "PData",
                            Penalty1: d,
                            Penalty2: Penalty2,
                          });
                          return d;
                        });
                      f === "#4fe04f" &&
                        setPenalty1((g) => {
                          let d = g.map((v, h) => (i === h ? "#f23f3f" : v));
                          emit("Editor", {
                            type: "PData",
                            Penalty1: d,
                            Penalty2: Penalty2,
                          });
                          return d;
                        });
                      f === "#f23f3f" &&
                        setPenalty1((g) => {
                          let d = g.map((v, h) => (i === h ? "#727372" : v));
                          emit("Editor", {
                            type: "PData",
                            Penalty1: d,
                            Penalty2: Penalty2,
                          });
                          return d;
                        });
                    }}
                  />
                ))}
              </div>
              <div className="p-1 border-t-2 border-l-[1px]">
                <button
                  onClick={() =>
                    setPenalty1((g) => {
                      let d = [...g].slice(0, g.length - 1);
                      emit("Editor", {
                        type: "PData",
                        Penalty1: d,
                        Penalty2: Penalty2,
                      });
                      return d;
                    })
                  }
                  className="inline-block w-6/12 border-r-2"
                >
                  -
                </button>
                <button
                  onClick={() =>
                    setPenalty1((g) => {
                      let d = [...g, "#727372"];
                      emit("Editor", {
                        type: "PData",
                        Penalty1: d,
                        Penalty2: Penalty2,
                      });
                      return d;
                    })
                  }
                  className="inline-block w-6/12"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="grid h-full grid-cols-5 border-l-[1px]">
                {Penalty2.map((f, i) => (
                  <button
                    className="h-10 border-2 border-white w-full rounded-md"
                    style={{ backgroundColor: f }}
                    onClick={() => {
                      f === "#727372" &&
                        setPenalty2((g) => {
                          let d = g.map((v, h) => (i === h ? "#4fe04f" : v));
                          emit("Editor", {
                            type: "PData",
                            Penalty1: Penalty1,
                            Penalty2: d,
                          });
                          return d;
                        });
                      f === "#4fe04f" &&
                        setPenalty2((g) => {
                          let d = g.map((v, h) => (i === h ? "#f23f3f" : v));
                          emit("Editor", {
                            type: "PData",
                            Penalty1: Penalty1,
                            Penalty2: d,
                          });
                          return d;
                        });
                      f === "#f23f3f" &&
                        setPenalty2((g) => {
                          let d = g.map((v, h) => (i === h ? "#727372" : v));
                          emit("Editor", {
                            type: "PData",
                            Penalty1: Penalty1,
                            Penalty2: d,
                          });
                          return d;
                        });
                    }}
                  />
                ))}
              </div>
              <div className="p-1 border-t-2 border-l-[1px]">
                <button
                  onClick={() =>
                    setPenalty2((g) => {
                      let d = [...g].slice(0, g.length - 1);
                      emit("Editor", {
                        type: "PData",
                        Penalty1: Penalty1,
                        Penalty2: d,
                      });
                      return d;
                    })
                  }
                  className="inline-block w-6/12 border-r-2"
                >
                  -
                </button>
                <button
                  onClick={() =>
                    setPenalty2((g) => {
                      let d = [...g, "#727372"];
                      emit("Editor", {
                        type: "PData",
                        Penalty1: Penalty1,
                        Penalty2: d,
                      });
                      return d;
                    })
                  }
                  className="inline-block w-6/12"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FEdit;
