import { IoMdFootball } from "react-icons/io";

const Goal = ({ Player }) => {
  return (
    <div className="w-full">
      <div className="bg-slate-100 m-auto flex w-fit rounded-full">
        <div className="text-7xl inline-block rounded-full">
          <IoMdFootball />
        </div>
        <div className="p-5 pr-10 inline-block text-3xl">{Player} Scorred</div>
      </div>
    </div>
  );
};
export default Goal;
