import Button from "../../commonComponent/Button";
import { settingTabs } from "../../components/Receptionist/SettingTabs";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate=useNavigate();
  const location=useLocation();

  return (
    <>
      <div className="h-[100%] w-full  rounded-lg">
        <div className="flex flex-wrap justify-center items-center gap-4  p-2 mb-2  rounded-lg">
          {settingTabs.map((item) => {
            const fullPath = item.path ? `/setting/${item.path}` : "/setting"; 
            return (
            <Button
              key={item.tabName}
              className={`${
                location.pathname === fullPath
                  ? "bg-[#521785] text-white"
                  : "bg-[#f2e2ff] text-[#343c6a]"
              } font-semibold text-[14px] min-w-[140px]  p-2`}
              onClick={()=>navigate(fullPath)}
            >
              {item.title}
            </Button>
          )
          } )}
        </div>
        <div
          className="h-[95%] lg:h-[90%] bg-white shadow-md  rounded-lg w-full py-4 flex  flex-col items-center overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
         <Outlet />
        </div>
      </div>
    </>
  );
};

export default Settings;
