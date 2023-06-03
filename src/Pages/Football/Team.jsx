const Team = ({ Name1, Name2, Team1, Team2 }) => {
  return (
    <main className="w-full text-white text-center text-3xl h-full">
      <div className="grid grid-cols-2 space-x-2 m-auto w-fit">
        <div className="w-full">
          <div className="p-2 bg-stone-900 px-20 mb-2">{Name1}</div>
          <ul className="w-full">
          {Team1.map((e) => {
            return <li className="py-2 px-10 bg-stone-100 min-h-[52px] even:bg-opacity-10 odd:bg-opacity-30">{e.Name}</li>;
          })}
          </ul>
        </div>
        <div className="w-full">
          <div className="p-2 bg-stone-900  mb-2">{Name2}</div>
          <ul className="w-full">
          {Team2.map((e) => {
            return <li className="py-2 px-10 bg-stone-100 min-h-[52px] even:bg-opacity-10 odd:bg-opacity-30">{e.Name}</li>;
          })}
          </ul>
        </div>
      </div>
    </main>
  );
};
export default Team;
