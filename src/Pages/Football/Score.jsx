const Score = ({
  Name1,
  Name2,
  Score1,
  Score2,
  counter,
  extra,
  Penalty1,
  Penalty2,
  PShow,
}) => {
  const PScore1 = Penalty1.filter((d) => d === "#4fe04f").length;
  const PScore2 = Penalty2.filter((d) => d === "#4fe04f").length;
  return (
    <main className="w-full h-full scale-75 ">
      <div className={"grid w-fit pt-1 mx-auto text-4xl"}>
        <div className="flex px-2 bg-white rounded-full bg-opacity-90">
          <div className={"py-5 px-5 grid relative"}>
            {Name1}
            <div
              className={
                "grid grid-cols-5 w-[250px] gap-x-4 gap-y-2 -right-2 left-auto mr-5 drtl mt-[90px] absolute " +
                (!PShow && "opacity-0")
              }
            >
              {Penalty1.map((h) => (
                <div
                  style={{ backgroundColor: h }}
                  className="w-6 m-1 aspect-square rounded-full"
                />
              ))}
            </div>
          </div>
          <div className="py-4 relative px-5 font-Mobot text-5xl font-semibold bg-stone-800 bg-opacity-90  text-white">
            {Score1}
            <div
              className={
                "py-4 rounded-b-full absolute px-5 font-Mobot mt-[16px] scale-95 left-0 text-5xl font-semibold bg-neutral-500 text-white " +
                (!PShow && "opacity-0")
              }
            >
              {PScore1}
            </div>
          </div>
          <div className="text-4xl relative grid bg-opacity-90 font-semibold font-Mobot bg-blue-600 px-5 py-5 text-white w-fit text-center">
            {`${Math.floor(counter / 60)
              .toString()
              .padStart(2, "0")}:${(counter % 60).toString().padStart(2, "0")}`}
            <div
              className={
                "text-3xl w-full mt-[80px] absolute font-semibold font-Mobot bg-opacity-30 bg-stone-100 py-3 text-white text-center " +
                (!extra && "opacity-0")
              }
            >
              {`${Math.floor(extra / 60)
                .toString()
                .padStart(2, "0")}  
               : 
              ${(extra % 60).toString().padStart(2, "0")}`}
            </div>
          </div>
          <div className="py-4 relative px-5 font-Mobot text-5xl font-semibold bg-stone-800 bg-opacity-90  text-white">
            {Score2}
            <div
              className={
                "py-4 rounded-b-full absolute px-5 font-Mobot mt-[16px] scale-95 left-0 text-5xl font-semibold bg-neutral-500 text-white " +
                (!PShow && "opacity-0")
              }
            >
              {PScore2}
            </div>
          </div>
          <div className={"py-5 px-5 grid relative"}>
            {Name2}
            <div
              className={
                "grid grid-cols-5 -scale-x-100 w-[250px] gap-x-4 gap-y-2 ml-5 drtl mt-[90px] absolute " +
                (!PShow && "opacity-0")
              }
            >
              {Penalty2.map((h) => (
                <div
                  style={{ backgroundColor: h }}
                  className="w-6 m-1 aspect-square rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Score;
