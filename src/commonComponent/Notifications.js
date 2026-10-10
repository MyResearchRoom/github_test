import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteNotification,
  getNotifications,
  updateToMarkAsRead,
} from "../store/slices/notificationSlice";
import useModalClose from "../hooks/useModalClose";

const Notifications = ({ setIsNotification }) => {
  const dispatch = useDispatch();
  const modalRef = useRef();
  const handleClose=()=>{
    setIsNotification(false)
  }
  useModalClose(modalRef, handleClose);
  const isConnected = useSelector((state) => state.webSocket.connected);
  const notifications = useSelector((state) => state?.notify?.notifications);
  const currentPage = useSelector((state) => state?.notify?.currentPage);
  const totalPages = useSelector((state) => state?.notify?.totalPages);
  const itemsPerPage = useSelector((state) => state?.notify?.itemsPerPage);
  const loading = useSelector((state) => state?.notify?.loading);

  const [isPerformAction, setIsPerformAction] = useState(false);
  const actionRef = useRef(null);

  function getShortName(str) {
    const words = str.split(" ");
    const startIndex = words.indexOf("Receptionist");
    const endIndex = words.indexOf("checked");

    const nameParts = words.slice(startIndex + 1, endIndex);
    const firstName = nameParts[0].charAt(0).toUpperCase();
    const lastName = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    const fullName = firstName + lastName;
    return fullName;
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      dispatch(
        getNotifications({ page: currentPage + 1, limit: itemsPerPage })
      );
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      dispatch(
        getNotifications({ page: currentPage - 1, limit: itemsPerPage })
      );
    }
  };

  const updateNotification = (type, id) => {
    if (type === "read") {
      dispatch(updateToMarkAsRead(id));
    } else if (type === "delete") {
      dispatch(deleteNotification(id));
    }
  };

  useEffect(() => {
    if (isConnected) {
      dispatch(getNotifications({ page: currentPage, limit: itemsPerPage }));
    }
  }, [isConnected]);

  useEffect(()=>{
    const handleClickOutside=(e)=>{
      if(actionRef.current && !actionRef.current.contains(e.target)){
        setIsPerformAction(false);
      }
    }
    if(isPerformAction){
      document.addEventListener('mousedown',handleClickOutside)
    }
    return ()=>{
      document.addEventListener('mousedown',handleClickOutside)
    }

  },[isPerformAction])

  return (
    <div className="relative">
      <AnimatePresence>
        <motion.div
        ref={modalRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-2  w-[550px] bg-white rounded-xl shadow-2xl z-50 "
        >
          <div className="flex justify-between mb-2 px-4 py-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Notifications
            </h3>
            <div className="flex  gap-3">
              {/* <input type="date" name="date" value={date} onChange={(e)=>setDate(e.target.value)} className="outline-none border border-zinc-400 rounded-[4px] px-2 text-gray-600" /> */}
              {/* <Button
                variant="outlined"
                className="!text-[15px] !capitalize  !text-blue-600 !border !border-blue-600"
              >
                Mark all as read
              </Button> */}

              <button onClick={() => setIsNotification(false)}>
                <RxCross2 className="w-6 h-6 text-gray-500 hover:text-gray-700 transition" />
              </button>
            </div>
          </div>
          <div
            className="max-h-[70vh] overflow-y-auto divide-y"
            style={{ scrollbarWidth: "thin" }}
          >
            {loading ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                <p className="text-center text-primary text-base">
                  {" "}
                  Loading ...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                No notifications available.
              </div>
            ) : (
              notifications.length > 0 &&
              notifications.map((note) => (
                <div
                  key={note.id}
                  className={`cursor-pointer flex items-start gap-3  px-4 py-2 hover:bg-gray-200 transition  ${
                    !note.isRead ? "bg-gray-100" : ""
                  } `}
                >
                  <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold text-sm shadow-inner bg-white">
                    {getShortName(note?.message)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 line-clamp-2">
                      {note?.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(note.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                  <div
                    className="relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <HiDotsVertical
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPerformAction((prev) =>
                          prev === note.id ? null : note.id
                        );
                      }}
                      className="w-4 h-4 text-gray-500 cursor-pointer"
                    />
                    {isPerformAction === note.id && (
                      <div
                        ref={actionRef}
                        className="absolute top-6 right-0 w-[160px] bg-white shadow-lg border border-gray-200 rounded-md z-10"
                      >
                        <button
                          disabled={note.isRead}
                          onClick={() => updateNotification("read", note.id)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border-b border-gray-300 hover:bg-gray-100 hover:text-blue-600 transition"
                        >
                          Mark as Read
                        </button>
                        <button
                          onClick={() => updateNotification("delete", note.id)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <div className="flex justify-end items-center gap-2  px-4 py-2 mt-4">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`h-8 w-8 flex items-center justify-center rounded-full transition ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
                aria-label="Previous Page"
              >
                <MdKeyboardArrowLeft className="w-5 h-5" />
              </button>

              <span className="text-sm font-medium text-gray-700 px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`h-8 w-8 flex items-center justify-center rounded-full transition ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
                aria-label="Next Page"
              >
                <MdKeyboardArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
