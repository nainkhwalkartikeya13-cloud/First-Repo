const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Add Category",
  handleDelete,
}) => {
  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="mt-1 p-2.5 border rounded-lg w-[90%] bg-white dark:bg-gray-800/50 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white outline-none border-gray-300 dark:border-gray-600 focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
          placeholder="Write category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="flex justify-between gap-4 mt-4">
          <button className="bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-white dark:text-gray-900 border-none outline-none md:w-[180px] px-4 py-2.5 cursor-pointer text-base font-semibold rounded-lg shadow-sm">
            {buttonText}
          </button>

          {handleDelete && (
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 transition-colors text-white border-none outline-none md:w-[180px] px-4 py-2.5 cursor-pointer text-base font-semibold rounded-lg shadow-sm"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
