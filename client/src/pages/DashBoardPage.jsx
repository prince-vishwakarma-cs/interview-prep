import { Plus } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DeleteAlertContent from "../components/DeleteAlertContent";
import Modal from "../components/Modal";
import { SummaryCard } from "../components/cards/SummaryCard";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { useDeleteSessionMutation, useGetAllSessionsQuery } from "../redux/api/sessionAPi";
import { CARD_BG } from "../utils/data";

const SkeletonLine = ({ width = "full", height = "h-3" }) => (
  <div
    className={`bg-gray-200 dark:bg-gray-700/10 ${height} w-${width} rounded-md`}
  />
);

const SkeletonSection = ({ lines = [], containerClasses = "space-y-2" }) => (
  <div className={containerClasses} role="status">
    {lines.map((line, idx) => (
      <SkeletonLine key={idx} width={line.width} height={line.height} />
    ))}
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4 animate-pulse">
    <SkeletonSection
      lines={[
        { width: "3/4", height: "h-5" },
        { width: "2/3", height: "h-4" },
      ]}
    />
    <SkeletonSection
      lines={[{ width: "full" }, { width: "11/12" }, { width: "10/12" }]}
    />
    <SkeletonSection lines={[{ width: "1/2", height: "h-3" }]} />
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [deleteAlert, setDeleteAlert] = useState({
    open: false,
    session: null,
  });

 
  const [deleteSession ,{isLoading} ] = useDeleteSessionMutation()

 const { data, isLoading: isFetchingSessions } = useGetAllSessionsQuery();

  const sessionData = data?.data;
  const handleDelete = async () => {
    try {
      await deleteSession(deleteAlert.session._id)
      toast.success("Session deleted");
      setDeleteAlert({ open: false, session: null });
    } catch (err) {
      toast.error("Delete failed");
    }
  };


if (isFetchingSessions) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-gray-500 dark:text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg font-medium text-primary-text">Loading sessions...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-full px-4 sm:px-6 lg:px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sessionData.map((session, idx) => (
              <SummaryCard
                key={session._id}
                colors={CARD_BG[idx % CARD_BG.length]}
                role={session.role}
                topicsToFocus={session.topicsToFocus}
                experience={session.experience}
                questions={session.questions?.length}
                description={session.description}
                lastUpdated={
                  session.updatedAt
                    ? moment(session.updatedAt).format("Do MMM YYYY")
                    : ""
                }
                onSelect={() => navigate(`/prep/${session._id}`)}
                onDelete={() => setDeleteAlert({ open: true, session })}
              />
            ))}
          </div>
        )}

        <button
          className=" fixed bottom-10 right-10 flex items-center text-sm font-semibold px-6 py-2.5 rounded-full bg-light-button-bg-color text-light-button-color transition-colors hover:bg-light-button-hover-bg-color hover:text-light-button-hover-color"
          onClick={() => navigate("/create-session")}
        >
          <Plus size={20} />
          Add New
        </button>
      </div>

     

      <Modal
        isOpen={deleteAlert.open}
        onClose={() => setDeleteAlert({ open: false, session: null })}
        title="Delete Session"
      >
        <div className="p-6">
          <DeleteAlertContent
            content="Are you sure you want to delete this session?"
            onDelete={handleDelete}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
