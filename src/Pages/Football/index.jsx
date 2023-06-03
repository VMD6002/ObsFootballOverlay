import Score from "./Score";
import Team from "./Team";
import Goal from "./Goal";
import RedCard from "./RedCard";
import YellowCard from "./YellowCards";
import InAndOut from "./InOut";
import { listen } from "@tauri-apps/api/event";
import { useState, useEffect } from "react";
import useCountDown from "../../hooks/useCountDown";

const Overlay = () => {
  const { counter, setTime, start, pause, reset, extra } = useCountDown(1000);
  let [scale, setScale] = useState(
    Math.round(
      Math.min(window.innerWidth / 1920, window.innerHeight / 1080) * 100
    ) / 100
  );
  const [Player, setPlayer] = useState({
    Name: "hello",
    Yellow: false,
    Red: false,
    Scorred: false,
    Team: "",
  });
  const [InOut, setInOut] = useState({
    In: "Hello",
    Out: "Wayomi",
    show: false,
  });
  const [Players1, setPlayers1] = useState([]);
  const [Players2, setPlayers2] = useState([]);
  const [Name1, setName1] = useState("");
  const [Name2, setName2] = useState("");
  const [Score1, setScore1] = useState(0);
  const [Score2, setScore2] = useState(0);
  const [team, setTeam] = useState(false);
  const [PShow, setPShow] = useState(false);
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

  useEffect(() => {
    listen("Editor", (event) => {
      switch (event.payload.type) {
        case "start":
          setTime(event.payload.Data);
          start();
          break;
        case "close":
          close();
          break;
        case "pause":
          pause();
          break;
        case "reset":
          setTime(event.payload.Data);
          reset(event.payload.Data.start);
          break;
        case "Score1":
          setScore1(event.payload.Data);
          break;
        case "Score2":
          setScore2(event.payload.Data);
          break;
        case "TData":
          setPlayers1(event.payload.Players1);
          setPlayers2(event.payload.Players2);
          setName1(event.payload.Name1);
          setName2(event.payload.Name2);
          setScore1(event.payload.Score1);
          setScore2(event.payload.Score2);
          setPenalty1(event.payload.Penalty1)
          setPenalty2(event.payload.Penalty2)
          break;
        case "TShow":
          setTeam(true);
          break;
        case "THide":
          setTeam(false);
          break;
        case "PShow":
          setPShow(event.payload.Data);
          break;
        case "PData":
          setPenalty1(event.payload.Penalty1)
          setPenalty2(event.payload.Penalty2)
          break;
        case "Green":
          setPlayer({ Name: "", Yellow: false, Red: false, Scorred: false });
          setInOut({ In: "", Out: "", show: false });
          break;
        case "Yellow":
          setPlayer({
            Name: event.payload.Name,
            Team: event.payload.Team,
            Yellow: true,
            Red: false,
            Scorred: false,
          });
          break;
        case "Red":
          setPlayer({
            Name: event.payload.Name,
            Team: event.payload.Team,
            Yellow: false,
            Red: true,
            Scorred: false,
          });
          break;
        case "Scorred":
          setPlayer({
            Name: event.payload.Name,
            Team: event.payload.Team,
            Yellow: false,
            Red: false,
            Scorred: true,
          });
          break;
        case "InOut":
          setInOut(event.payload.Data);
          break;
        case "scale":
          setScale(event.payload.Data);
          break;
      }
    });
  }, [start, pause, reset]);
  return (
    <div
      style={{ transform: `scale(${scale})` }}
      className="w-full relative h-full min-h-full"
    >
      <div className="absolute flex flex-col justify-between h-screen w-full">
        <div className="absolute w-full">
          <Score
            Name1={Name1}
            Name2={Name2}
            Score1={Score1}
            Score2={Score2}
            counter={counter}
            extra={extra}
            PShow={PShow}
            Penalty1={Penalty1}
            Penalty2={Penalty2}
          />
        </div>
        <div
          className={
            "transition-all absolute w-full top-[160px] " +
            (team ? "opacity-100" : "opacity-0")
          }
        >
          <Team Name1={Name1} Name2={Name2} Team1={Players1} Team2={Players2} />
        </div>
        <div className="w-full absolute top-[800px] grid place-items-center">
          {Player.Scorred && <Goal Player={Player.Name} />}
          {InOut.show && <InAndOut In={InOut.In} Out={InOut.Out} />}
          {Player.Red && <RedCard Player={Player.Name} Team={Player.Team} />}
          {Player.Yellow && (
            <YellowCard Player={Player.Name} Team={Player.Team} />
          )}
        </div>
      </div>
    </div>
  );
};
export default Overlay;
