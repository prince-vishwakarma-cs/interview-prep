import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import DeleteAlertContent from "../../components/DeleteAlertContent";
import Modal from "../../components/Modal";
import { SummaryCard } from "../../components/cards/SummaryCard";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { API_PATHS } from "../../utils/api";
import { axiosInstance } from "../../utils/axios";
import { CARD_BG } from "../../utils/data";
import { CreateSessionForm } from "./CreateSessionForm";

const SkeletonLine = ({ width = "full", height = "h-3" }) => (
  <div className={`bg-gray-200 dark:bg-gray-700/10 ${height} w-${width} rounded-md`} />
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
    <SkeletonSection lines={[{ width: "3/4", height: "h-5" }, { width: "2/3", height: "h-4" }]} />
    <SkeletonSection lines={[{ width: "full" }, { width: "11/12" }, { width: "10/12" }]} />
    <SkeletonSection lines={[{ width: "1/2", height: "h-3" }]} />
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState({ open: false, session: null });

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load sessions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(
        API_PATHS.SESSION.DELETE(deleteAlert.session._id)
      );
      toast.success("Session deleted");
      setDeleteAlert({ open: false, session: null });
      fetchSessions();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <DashboardLayout>
      <div className="max-w-full mx-8 px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sessions.map((session, idx) => (
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
          onClick={() => setCreateOpen(true)}
          className="fixed bottom-10 right-10 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF9324] to-[rgb(233,154,75)] text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
        >
          <LuPlus size={20} />
          Add New
        </button>
      </div>

      <Modal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)} hideHeader>
      <CreateSessionForm
  onClose={() => setCreateOpen(false)}
  onRefresh={fetchSessions}
/>

      </Modal>

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
