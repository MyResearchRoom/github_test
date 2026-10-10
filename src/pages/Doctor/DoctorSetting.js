import Button from "../../commonComponent/Button";
import { settingTabs } from "../../components/Doctor/setting/SettingTabs";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const DoctorSetting = () => {
 const navigate=useNavigate();
 const location=useLocation();

  return (
    <div className="h-[100%] w-full  rounded-lg">
      {/* Navbar for settings */}
      <div className="flex  items-center flex-wrap gap-4 p-2 mb-2  rounded-lg">
        {settingTabs.map((item) => {
          const fullPath = item.path ? `/setting/${item.path}` : "/setting"; 
          return (
          <Button
            key={item.tabName}
            className={`${
              location.pathname === fullPath
                ? "bg-[#521785] text-white"
                : "bg-[#f2e2ff] text-[#343c6a]"
            } font-semibold text-[14px] min-w-[130px]   p-2`}
            onClick={() => navigate(fullPath)}
          >
            {item.title}
          </Button>
        )
        })}
      </div>

      {/* Data to be displayed */}
      <div
        className="w-[100%] lg:h-[90%] h-[95%]  bg-white shadow-md  rounded-lg flex  flex-col items-center  overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default DoctorSetting;
