const OrDivider = () => {
  return (
    <div className="flex items-center my-4">
      <div className="flex-grow h-px w-44 bg-gray-300 " />
      <span className="px-3 text-sm text-gray-500 italic">or</span>
      <div className="flex-grow h-px bg-gray-300 w-44 " />
    </div>
  );
};

export default OrDivider;