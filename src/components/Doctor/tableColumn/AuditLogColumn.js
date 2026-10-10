export const AuditLogColumn = () => {
  return [
    {
      label: "Id",
      field: "",
      render: (item)=>(
        <div className="w-[10%] pl-1">
            <p className="text-left w-full">{item?.user?.id}</p>
        </div>
      ),
      headerClassName:
        "text-left pl-1   border-[#d3cccc] w-[10%]",
      className: "text-sm  text-left pl-1  border-[#d3cccc] w-[10%]",
    },
    {
        label:'Name',
        field:"name",
        render: (item)=>(
        <div className="">
            <p className="text-left pl-1">{item?.user?.name}</p>
        </div>
      ),
        headerClassName: "text-left pl-1  border-[#d3cccc] ",
      className: "text-left pl-1 text-sm ",
    },
    {
        label:'Date-Time',
        field:"",
         render: (item)=>{
          const formattedDate=(date)=>{
            const d=new Date(date);
            const year=d.getFullYear();
            const month=String(d.getMonth()+1).padStart(2,"0");
            const day=String(d.getDate()).padStart(2,"0");
            const hours = String(d.getHours()).padStart(2, "0");
            const minutes = String(d.getMinutes()).padStart(2, "0");
            const seconds = String(d.getSeconds()).padStart(2, "0");
            return `${day}-${month}-${year} At ${hours}:${minutes}`;
          }
          return(
 <div className="">
            <p className="text-center ">{formattedDate(item?.createdAt)}</p>
        </div>
          )
         }
       
      ,
        headerClassName: "  border-[#d3cccc]",
        className: "text-sm",
    },
    {
        label:"IP Address",
        field:"ipAddress",
        headerClassName: "text-left pl-1  border-[#d3cccc] w-[10%]",
      className: "text-left pl-1 text-sm w-[10%]",
    },
    {
        label:"User Agent",
        field:"userAgent",
         className: "text-left pl-1 text-sm  border-[#d3cccc] w-[50%]",
      headerClassName:
        "text-left pl-1   border-[#d3cccc]  w-[50%]",
    }
  ];
};
