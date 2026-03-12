import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApislice";
import { toast } from "react-toastify";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        refetch();
        toast.success("User deleted successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-white min-h-[100vh] text-gray-900 dark:text-gray-900 transition-colors duration-300 pb-20 pt-10">
      <h1 className="md:text-2xl font-semibold mb-8 flex items-center justify-center uppercase md:border-b-2 border-gray-200 dark:border-gray-200 md:mx-[40%] text-gray-900 dark:text-gray-900">
        All Users
      </h1>
      {isLoading ? (
        <div className="w-full max-h-screen flex items-center justify-center">
          <Loader />
        </div>
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="flex flex-col md:flex-row">
          <div className="overflow-x-auto bg-white dark:bg-white rounded-xl shadow-sm border border-gray-200 dark:border-gray-200 p-6 mx-4 md:mx-auto max-w-7xl w-full">
            <table className="w-full text-left border-collapse">
              <thead className="w-full">
                <tr className="border-b border-gray-200 dark:border-gray-200 mb-4 text-gray-700 dark:text-gray-600 font-semibold">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Admin</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody className="my-8">
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100 dark:border-gray-100 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-medium">{user._id}</td>
                    <td className="px-4 py-4">
                      {editableUserId === user._id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editableUserName}
                            onChange={(e) => setEditableUserName(e.target.value)}
                            className="w-full p-2.5 border rounded-lg bg-white dark:bg-white placeholder-gray-400 dark:placeholder-gray-400 text-gray-900 dark:text-gray-900 outline-none border-gray-300 dark:border-gray-300 focus:border-gray-400 dark:focus:border-gray-400 transition-colors"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="ml-2 bg-accent-blue hover:bg-accent-blue-hover text-white p-3 rounded-lg shadow-sm transition-colors"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          {user.username}{" "}
                          <button
                            onClick={() =>
                              toggleEdit(user._id, user.username, user.email)
                            }
                            className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                          >
                            <FaEdit className="ml-4" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {editableUserId === user._id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editableUserEmail}
                            onChange={(e) => setEditableUserEmail(e.target.value)}
                            className="w-full p-2.5 border rounded-lg bg-white dark:bg-white placeholder-gray-400 dark:placeholder-gray-400 text-gray-900 dark:text-gray-900 outline-none border-gray-300 dark:border-gray-300 focus:border-gray-400 dark:focus:border-gray-400 transition-colors"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="ml-2 bg-accent-blue hover:bg-accent-blue-hover text-white p-3 rounded-lg shadow-sm transition-colors"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <a href={`mailto:${user.email}`}>{user.email}</a>{" "}
                          <button
                            onClick={() =>
                              toggleEdit(user._id, user.name, user.email)
                            }
                            className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                          >
                            <FaEdit className="ml-4" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {user.isAdmin ? (
                        <FaCheck style={{ color: "green" }} />
                      ) : (
                        <FaTimes className="text-red-500 dark:text-red-400" />
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      {!user.isAdmin && (
                        <div className="flex justify-end">
                          <button
                            onClick={() => deleteHandler(user._id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 p-2.5 rounded-lg transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserList;
