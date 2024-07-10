import { endOfWeek, format, startOfWeek } from "date-fns";
import { useFetchData } from "../CustomHooks/serverStateHooks";
import { useGlobalStore } from "../zustandStore/store";
import { PieChart } from "@mui/x-charts/PieChart";
export default function HomePage() {
  const { globalProfileData } = useGlobalStore();
  const { data: stats } = useFetchData(
    `/stats/financialStatistics${globalProfileData.id}`,
    ["homePage"],
    {
      start_date: format(startOfWeek(new Date()), "yyyy-MM-dd"),
      end_date: format(endOfWeek(new Date()), "yyyy-MM-dd"),
    }
  );

  return (
    <>
      <div className="w-full space-y-4 h-full bg-white">
        <h1 className="tracking-widest font-semibold  text-3xl text-center">
          Weekly Statistics
        </h1>
        <h2></h2>
        <div className="w-full h-2/4 p-4 flex">
          <div className=" text-lg space-y-4 w-1/3 flex items-center pl-12 text-white  py-4  bg-slate-400">
            <div className="space-y-4">
              <p>
                Total Appointment number:{" "}
                {stats?.appointmentCount ? stats.appointmentCount : "0"}
              </p>
              <p>Total Value: R{stats?.totalValue ? stats.totalValue : "0"} </p>
              <p>
                Total collected: R
                {stats?.totalCollected ? stats.totalCollected : "0"}
              </p>
              <p>
                Total Outstanding: R
                {stats?.totalOutstanding ? stats.totalOutstanding : "0"}
              </p>
              <p>
                Total Discount: R
                {stats?.totalDiscount ? stats.totalDiscount : "0"}
              </p>
            </div>
          </div>
          <div className="w-2/4 bg-white border-none flex justify-center items-center ">
            <PieChart
              series={[
                {
                  data: [
                    {
                      id: 0,
                      label: "Total Value",
                      value: stats?.totalValue || 0,
                    },
                    {
                      id: 1,
                      label: "Collected",
                      value: stats?.totalCollected || 0,
                    },
                    {
                      id: 2,
                      label: "Outstanding",
                      value: stats?.totalOutstanding || 0,
                    },
                    {
                      id: 3,
                      label: "Discount",
                      value: stats?.totalDiscount || 0,
                    },
                  ],
                  innerRadius: 8,
                  outerRadius: 100,
                  paddingAngle: 5,
                  cornerRadius: 4,
                  startAngle: -100,
                  endAngle: 180,

                  highlightScope: { faded: "global", highlighted: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                },
              ]}
              height={200}
            />
          </div>
        </div>
      </div>
    </>
  );
}
