"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  Users, 
  User, 
  Crown, 
  Shield, 
  Trash2, 
  Loader2,
  Mail,
  Calendar,
  FileText,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { getAllUsers, updateUserRole, deleteUser } from "@/lib/api/users";

const STAT_CONFIG = [
  { key: "total",    label: "Total Users",   icon: Users,    change: "All registered" },
  { key: "admins",   label: "Admins",        icon: Shield,   change: "Full access"    },
  { key: "creators", label: "Creators",      icon: Crown,    change: "Publishing"     },
  { key: "regular",  label: "Regular Users", icon: User,     change: "Explorers"      },
  { key: "premium",  label: "Premium",       icon: Sparkles, change: "Subscribed"     },
];

const ROLE_CONFIG = {
  admin:   { cls: "bg-purple-50 text-purple-600 border-purple-200", icon: <Shield   className="w-3 h-3" /> },
  creator: { cls: "bg-blue-50   text-blue-600   border-blue-200",   icon: <Crown    className="w-3 h-3" /> },
  user:    { cls: "bg-gray-100  text-gray-500   border-gray-200",   icon: <User     className="w-3 h-3" /> },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const AllUserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [roleModal, setRoleModal] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  //  Fetch Users 
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data || []);
      updateStats(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  //  Update Stats
  const updateStats = (data) => {
    const total    = data?.length || 0;
    const admins   = data?.filter(u => u.role === "admin").length   || 0;
    const creators = data?.filter(u => u.role === "creator").length || 0;
    const regular  = data?.filter(u => u.role === "user" || !u.role).length || 0;
    const premium  = data?.filter(u => u.plan === "premium").length || 0;
    setStats({ total, admins, creators, regular, premium });
  };

  //  Refresh without full page reload
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await getAllUsers();
      setUsers(data || []);
      updateStats(data || []);
      toast.success("Users refreshed!");
    } catch (error) {
      console.error("Error refreshing:", error);
      toast.error("Failed to refresh");
    } finally {
      setIsRefreshing(false);
    }
  };

  //  Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 📌 Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUsers();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchUsers]);

  //  Role Change
  const handleRoleUpdate = async (userId, newRole) => {
    // Find user to update
    const userToUpdate = users.find(u => u._id === userId);
    const oldRole = userToUpdate?.role || "user";
    
   
    setUsers(prev => 
      prev.map(u => 
        u._id === userId ? { ...u, role: newRole } : u
      )
    );
    
    // Update stats optimistically
    setStats(prev => {
      if (!prev) return prev;
      const roleKey = newRole === "user" ? "regular" : newRole === "creator" ? "creators" : "admins";
      const oldRoleKey = oldRole === "user" ? "regular" : oldRole === "creator" ? "creators" : "admins";
      
      return {
        ...prev,
        [roleKey]: prev[roleKey] + 1,
        [oldRoleKey]: prev[oldRoleKey] - 1
      };
    });

    setProcessingId(userId);
    try {
      const result = await updateUserRole(userId, newRole);
      toast.success(result.message || "✅ Role updated successfully");
      
     
      setRoleModal(null);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(error.message || "Failed to update role");
      
     
      setUsers(prev => 
        prev.map(u => 
          u._id === userId ? { ...u, role: oldRole } : u
        )
      );
      // Revert stats
      setStats(prev => {
        if (!prev) return prev;
        const roleKey = newRole === "user" ? "regular" : newRole === "creator" ? "creators" : "admins";
        const oldRoleKey = oldRole === "user" ? "regular" : oldRole === "creator" ? "creators" : "admins";
        return {
          ...prev,
          [roleKey]: prev[roleKey] - 1,
          [oldRoleKey]: prev[oldRoleKey] + 1
        };
      });
    } finally {
      setProcessingId(null);
    }
  };

  
  const handleDeleteUser = async () => {
    if (!deleteModal) return;
    
    const { userId, userName } = deleteModal;
    const userToDelete = users.find(u => u._id === userId);
    
    
    setUsers(prev => prev.filter(u => u._id !== userId));
    
    
    setStats(prev => {
      if (!prev) return prev;
      const role = userToDelete?.role || "user";
      const roleKey = role === "user" ? "regular" : role === "creator" ? "creators" : "admins";
      return {
        ...prev,
        total: prev.total - 1,
        [roleKey]: prev[roleKey] - 1,
        premium: userToDelete?.plan === "premium" ? prev.premium - 1 : prev.premium
      };
    });

    setProcessingId(userId);
    try {
      const result = await deleteUser(userId);
      toast.success(result.message || `${userName} deleted successfully`);
      setDeleteModal(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Failed to delete user");
      
      
      setUsers(prev => [...prev, userToDelete].sort((a, b) => a._id.localeCompare(b._id)));
      // Revert stats
      setStats(prev => {
        if (!prev) return prev;
        const role = userToDelete?.role || "user";
        const roleKey = role === "user" ? "regular" : role === "creator" ? "creators" : "admins";
        return {
          ...prev,
          total: prev.total + 1,
          [roleKey]: prev[roleKey] + 1,
          premium: userToDelete?.plan === "premium" ? prev.premium + 1 : prev.premium
        };
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getRoleBadge = (role) => {
    const key = role || "user";
    const { cls, icon } = ROLE_CONFIG[key] || ROLE_CONFIG.user;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
        {icon}
        <span className="capitalize">{key}</span>
      </span>
    );
  };

  const getPlanBadge = (plan) =>
    plan === "premium" ? (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">
        <Sparkles className="w-3 h-3" /> Premium
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
        Free
      </span>
    );

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#115a88]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">

      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#115a88]">All Users</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage registered users and their roles</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#115a88] bg-white border border-[#C7DFEA] rounded-xl hover:bg-[#f0f7fa] transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6"
        >
          {STAT_CONFIG.map(({ key, label, icon: Icon, change }) => (
            <motion.div
              key={key}
              variants={cardItem}
              whileHover={{ y: -3, boxShadow: "0 12px 24px -10px rgba(17,90,136,0.2)" }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="relative overflow-hidden bg-white rounded-2xl border border-[#C7DFEA] p-4 cursor-default"
            >
              <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full bg-[#C7DFEA] opacity-40" />
              <div className="relative flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs text-[#5a8aa6] font-medium truncate">{label}</span>
                  <span className="text-2xl font-bold text-[#0a3d5c]">
                    {stats[key]}
                  </span>
                  <span className="text-[11px] text-gray-400 truncate">{change}</span>
                </div>
                <div className="relative w-10 h-10 rounded-xl bg-[#115a88] flex items-center justify-center shadow-sm flex-shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Users Table */}
      {users.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-gray-400 text-sm">No users found</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-[#f8fafc]">
                  {["User", "Role", "Plan", "Prompts", "Joined", "Actions"].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider ${
                        h === "Actions" ? "text-right" : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {users.map((user, idx) => {
                    const isProcessing = processingId === user._id;
                    const initials = (user.name?.charAt(0) || user.email?.charAt(0) || "U").toUpperCase();

                    return (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20, scale: 0.9 }}
                        transition={{ duration: 0.2, delay: idx * 0.02 }}
                        layout
                        className={`border-b border-gray-50 hover:bg-[#f8fafd] transition-colors ${
                          idx % 2 === 0 ? "bg-white" : "bg-[#fafbfc]"
                        } ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
                      >
                        {/* User */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#115a88] to-[#0a9fd4] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">
                                {user.name || "Unknown"}
                              </p>
                              <p className="text-xs text-gray-400 flex items-center gap-1 truncate max-w-[180px]">
                                <Mail className="w-3 h-3 flex-shrink-0" />
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-4">
                          <motion.div
                            key={user.role || "user"}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                          >
                            {getRoleBadge(user.role)}
                          </motion.div>
                        </td>

                        {/* Plan */}
                        <td className="px-5 py-4">
                          {getPlanBadge(user.plan)}
                        </td>

                        {/* Prompts */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-[#e6f4fb] flex items-center justify-center">
                              <FileText className="w-3 h-3 text-[#115a88]" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              {user.promptCount || 0}
                            </span>
                            {user.pendingCount > 0 && (
                              <span className="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full font-medium">
                                {user.pendingCount} pending
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Joined */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-gray-300" />
                            <span className="text-xs text-gray-400">
                              {user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={user.role || "user"}
                              onChange={(e) => {
                                const newRole = e.target.value;
                                if (newRole === user.role) return;
                                setRoleModal({ userId: user._id, role: newRole, name: user.name });
                              }}
                              disabled={isProcessing || user.role === "admin"}
                              className="h-8 px-2 text-xs border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#115a88]/20 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <option value="user">User</option>
                              <option value="creator">Creator</option>
                              <option value="admin">Admin</option>
                            </select>

                            {user.role !== "admin" && (
                              <button
                                onClick={() => setDeleteModal({ userId: user._id, userName: user.name || user.email })}
                                disabled={isProcessing}
                                className="w-8 h-8 flex items-center justify-center text-red-400 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-40"
                                title="Delete User"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-[#f8fafc] border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing <span className="font-semibold text-gray-600">{users.length}</span> user{users.length !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-gray-400">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      <AnimatePresence>
        {roleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setRoleModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-full">
                  <Shield className="w-6 h-6 text-[#115a88]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">Change User Role</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Change <strong>{roleModal.name}</strong>'s role to{" "}
                    <strong className="text-[#115a88] capitalize">{roleModal.role}</strong>?
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setRoleModal(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRoleUpdate(roleModal.userId, roleModal.role)}
                  disabled={processingId === roleModal.userId}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#115a88] rounded-lg hover:bg-[#0e4e77] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {processingId === roleModal.userId && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-50 rounded-full">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">Delete User</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Are you sure you want to delete <strong>{deleteModal.userName}</strong>?
                  </p>
                  <p className="text-xs text-red-400 mt-2 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                    ⚠️ Permanently deletes the user and all their prompts, bookmarks, and data.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={processingId === deleteModal.userId}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {processingId === deleteModal.userId && <Loader2 className="w-4 h-4 animate-spin" />}
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllUserPage;