import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, MoreVertical, MapPin, Calendar, Camera } from "lucide-react";
import api from "../api/axios";

const MyIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

const [newIssue, setNewIssue] = useState({
  title: "",
  description: "",
  category: "",
  priority: "Medium",
});


  /* ---------------- FETCH MY ISSUES ---------------- */
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await api.get("/issues/my");
        console.log("MY ISSUES RESPONSE:", res.data);

        setIssues(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load your issues");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  /* ---------------- ADD ISSUE ---------------- */
  const handleAddIssue = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/issues", {
      title: newIssue.title,
      description: newIssue.description,
      category: newIssue.category,
      priority: newIssue.priority,
      is_public: false,
    });

    setIssues(prev => [res.data.issue, ...prev]);
    setIsModalOpen(false);

    setNewIssue({
      title: "",
      description: "",
      category: "",
      priority: "Medium",
    });
  } catch (err) {
    alert("Failed to submit issue");
  }
};

  /* ---------------- FILTER ---------------- */
  const filteredIssues =
    activeTab === "all"
      ? issues
      : issues.filter(
          (issue) =>
            issue.status?.toLowerCase().replace(" ", "-") === activeTab
        );

  /* ---------------- UI ---------------- */
  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400">
        Loading your issues...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">My Issues</h1>
          <p className="text-slate-400">Track your reported problems</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          <Plus size={18} className="mr-2" />
          Report Issue
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 mb-6 bg-slate-800/50 p-1 rounded-lg">
        {["all", "pending", "in-progress", "resolved"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm capitalize ${
              activeTab === tab
                ? "bg-indigo-500 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* ISSUES GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredIssues.map((issue) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6"
            >
              <div className="flex justify-between mb-3">
                <span className="text-xs px-2 py-1 rounded-full border text-indigo-400 border-indigo-400/20">
                  {issue.status.toUpperCase()}
                </span>
                <MoreVertical size={16} className="text-slate-400" />
              </div>

              <h3 className="text-lg text-white font-semibold mb-2">
                {issue.title}
              </h3>

                <p className="text-slate-400 text-sm mb-4">
    Category: {issue.category}
    </p>

    <div className="flex items-center text-sm text-slate-500">
    Priority: {issue.priority}
    </div>

    <div className="flex items-center text-sm text-slate-500">
    {new Date(issue.created_at).toLocaleDateString()}
    </div>

            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 rounded-xl p-6 w-full max-w-lg"
            >
              <h2 className="text-xl text-white mb-4">Report Issue</h2>

             <form onSubmit={handleAddIssue} className="space-y-4">

  <input
    placeholder="Title"
    className="w-full bg-slate-800 p-2 rounded"
    value={newIssue.title}
    onChange={(e) =>
      setNewIssue({ ...newIssue, title: e.target.value })
    }
    required
  />

  <select
    className="w-full bg-slate-800 p-2 rounded"
    value={newIssue.category}
    onChange={(e) =>
      setNewIssue({ ...newIssue, category: e.target.value })
    }
    required
  >
    <option value="">Select Category</option>
    <option value="Electrical">Electrical</option>
    <option value="Plumbing">Plumbing</option>
    <option value="Cleaning">Cleaning</option>
    <option value="Other">Other</option>
  </select>

  <textarea
    placeholder="Description"
    className="w-full bg-slate-800 p-2 rounded"
    value={newIssue.description}
    onChange={(e) =>
      setNewIssue({ ...newIssue, description: e.target.value })
    }
    required
  />

  <button className="w-full bg-indigo-600 py-2 rounded text-white">
    Submit
  </button>
</form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyIssues;
