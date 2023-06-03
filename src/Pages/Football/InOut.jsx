const InAndOut = ({ In , Out }) => {
  return (
    <div className="w-full">
      <div className="bg-slate-100 m-auto text-3xl flex w-fit overflow-hidden rounded-full">
        <span className="px-6 py-3 text-white bg-green-900">In</span>
        <span className="px-3 py-3 bg-green-100">{In}</span>
        <span className="px-6 py-3 text-white bg-red-700">Out</span>
        <span className="px-6 pl-3 py-3 bg-red-100">{Out}</span>
      </div>
    </div>
  );
};
export default InAndOut;
