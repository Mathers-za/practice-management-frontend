import { useFetchData } from "../CustomHooks/serverStateHooks";
import { useGlobalStore } from "../zustandStore/store";

export default function HomePage() {
  const { globalProfileData } = useGlobalStore();
  const { data: stats } = useFetchData(
    `/stats/financialStatistics${globalProfileData.id}`
  );
  return (
    <>
      <div className="w-full h-full bg-white">
        <div className="w-2/4 h-2/4 flex">
          <div className="border-r text-white p-4 border-black bg-slate-300">
            <p>
              Total Appointments:{" "}
              {stats?.appointmentCount ? stats.appointmentCount : "0"}
            </p>
            <p>Value: R{stats?.totalValue ? stats.totalValue : "0"} </p>
            <p>
              Total collected: R
              {stats.totalCollected ? stats.totalCollected : "0"}
            </p>
            <p>
              Total Outstanding: R
              {stats.totalOutstanding ? stats.totalOutstanding : "0"}
            </p>
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
}
