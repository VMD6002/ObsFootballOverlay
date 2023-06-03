import Yellow from "../../assets/YellowCard.svg";

const YellowCard = ({ Player, Team }) => {
  return (
    <div className="flex w-fit pl-32">
      <div className="mt-[3.3rem] text-right">
        <div>
          <span className="bg-slate-200 inline-block w-fit text-lg py-1 pl-4 pr-8 rounded-l-full">{Team}</span>
        </div>
        <span className="text-3xl h-fit pl-4 py-1 bg-slate-100 rounded-l-full pr-8">{Player}</span>
      </div>
      <div className="relative w-36">
        <img src={Yellow} className="h-36 rounded-full -left-14 absolute rounded-bl-none" />
      </div>
    </div>
  );
};
export default YellowCard;
