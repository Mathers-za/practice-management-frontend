import { endOfWeek, format, startOfWeek } from "date-fns";
import { useFetchData } from "../CustomHooks/serverStateHooks";
import { useDashBoardSideBar, useGlobalStore } from "../zustandStore/store";
import backgroundImage from "../images/palmTrees.webp";
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
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPositionX: "left",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}
        className="w-full space-y-4   py-4  h-full bg-white"
      >
        <h1 className="tracking-wider text-white underline underline-offset-4  font-semibold  text-3xl text-center">
          Weekly Statistics
        </h1>

        <div className="w-full h-fit gap-4 p-4 flex ">
          <div className=" text-lg shadow-md shadow-black/50 space-y-4 w-2/4 flex items-center pl-12 text-white  py-4  bg-slate-400">
            <div className="space-y-4">
              <h2 className="text-2xl ">Appointment Stats</h2>
              <p>
                Total Appointments this week:{" "}
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
          <div className="w-2/4 shadow-md shadow-black/50    p-4 text-white text-lg space-y-4 bg-blue-500">
            <h2 className="text-white text-2xl">Invoice Stats</h2>
            <p>Total invoices created: {stats?.totalInvoices || 0}</p>
            <p>Total invoices sent: {stats?.totalInvoicesSent || 0}</p>
            <p>Total invoices paid in full: {stats?.totalInvoicesPaid || 0}</p>
            <p>
              Total invoices that are unpaid and ready for invoicing:{" "}
              {stats?.totalInvoicesInProgress || 0}{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
