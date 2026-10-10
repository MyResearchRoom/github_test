export const DoctorDetailsCardSkeleton = () => {
  return (
    <div
      className="bg-white rounded-xl p-5 relative animate-pulse"
      style={{
        boxShadow: `rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px`,
      }}
    >
      {/* Status Badge */}
      <span className="absolute right-4 top-4">
        <div className="w-16 h-5 bg-gray-200 rounded-full"></div>
      </span>

      {/* Doctor Info */}
      <div className="mb-4 space-y-2">
        <div className="w-32 h-5 bg-gray-200 rounded"></div>
        <div className="w-24 h-4 bg-gray-200 rounded"></div>
        <div className="w-40 h-3 bg-gray-200 rounded"></div>
      </div>

      {/* Contact & Schedule */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="w-28 h-3 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="w-40 h-3 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="w-20 h-3 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="w-32 h-3 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Actions */}
      <div
        className="grid grid-cols-3 gap-2 mt-5"
        style={{ gridTemplateColumns: "1fr 0.2fr 0.2fr" }}
      >
        <div className="h-9 bg-gray-200 rounded"></div>
        <div className="h-9 bg-gray-200 rounded"></div>
        <div className="h-9 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};
