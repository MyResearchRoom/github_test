const TableComponent = ({
  columns,
  data,
  actions,
  actionLabel,
  headerBg,
  onClick,
  checkLabel,
  check,
  loading,
}) => {
  return (
     <table className="w-full bg-white text-[#343c6a]">
      <thead className={`sticky -top-1 h-12 z-10 ${headerBg}`}>
        <tr className="text-[15px] border-b border-[#d3cccc] ">
          {check && (
            <th
              className={`font-medium text-[15px] w-10 border-b border-t border-[#d3cccc]`}
            >
              {checkLabel}
            </th>
          )}
          {columns.map((col, index) => (
            <th key={index} className={`font-medium text-[15px] ${col.headerClassName}`}>
              {col.label}
            </th>
          ))}
          {actions && <th className={`font-medium text-[15px]`}>{actionLabel}</th>}
        </tr>
      </thead>
      <tbody className="">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <tr
              key={i}
              className="animate-pulse h-12 border-b border-r border-l border-[#d3cccc]"
            >
              {check && (
                <td className="">
                  <div className="bg-gray-200 h-4 w-4 rounded-[4px] mx-auto"></div>
                </td>
              )}
              {columns.map((_, index) => (
                <td key={index} className="px-2">
                  <div className="bg-gray-200 h-4 w-full "></div>
                </td>
              ))}
              {actions && (
                <td className="">
                  <div className="bg-gray-200 h-4 w-10 "></div>
                </td>
              )}
            </tr>
          ))
        ) : data.length > 0 ? (
          data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={(e) => {
                if (e.target.type !== "checkbox" && onClick) {
                  onClick(item);
                }
              }}
              className={`w-full font-medium border-b border-[#d3cccc]  text-[15px] h-14 cursor-pointer hover:bg-gray-50 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              {check && <td>{check ? check(item, rowIndex) : null}</td>}
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={`${col.className}`}>
                  {col.render ? col.render(item, rowIndex) : item[col.field]}
                </td>
              ))}
              {actions && <td>{actions ? actions(item, rowIndex) : null}</td>}
            </tr>
          ))
        )
         : (
          <tr>
            <td
              // colSpan={columns.length + (actions ? 1 : 0) + (check ? 1 : 0)}
              colSpan={Math.max(1, columns.length + (actions ? 1 : 0) + (check ? 1 : 0))}
              className="text-center py-2 border border-[#d3cccc]"
            >
              No data found
            </td>
          </tr>
        )
        }
      </tbody>
    </table>
  );
};

export default TableComponent;




// import React from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Checkbox,
//   Paper,
//   Skeleton,
// } from "@mui/material";

// const TableComponent = ({
//   columns,
//   data,
//   actions,
//   actionLabel,
//   headerBg,
//   onClick,
//   checkLabel,
//   check,
//   loading,
// }) => {
//   return (
//     <TableContainer component={Paper}>
//       <Table >
   
//         <TableHead
//           sx={{
//             position: "sticky",
//             top: 0,
//             zIndex: 10,
//             backgroundColor: headerBg || "white",
//           }}
//         >
//           <TableRow>
//             {check && <TableCell sx={{ fontWeight: 600 }}>{checkLabel}</TableCell>}
//             {columns.map((col, index) => (
//               <TableCell
//                 key={index}
//                 sx={{ fontWeight: 600,textAlign:"left",fontSize:15,padding:1,color:'#343c6a', ...col.headerSx}}
//                 className={col.headerClassName}
//               >
//                 {col.label}
//               </TableCell>
//             ))}
//             {actions && <TableCell sx={{ fontWeight: 600 }}>{actionLabel}</TableCell>}
//           </TableRow>
//         </TableHead>

  
//         <TableBody>
//           {loading ? (
//             Array.from({ length: 4 }).map((_, i) => (
//               <TableRow key={i}>
//                 {check && (
//                   <TableCell align="center">
//                     <Skeleton variant="rectangular" width={24} height={24} />
//                   </TableCell>
//                 )}
//                 {columns.map((_, colIndex) => (
//                   <TableCell key={colIndex}>
//                     <Skeleton variant="rectangular" width="100%" height={20} />
//                   </TableCell>
//                 ))}
//                 {actions && (
//                   <TableCell>
//                     <Skeleton variant="rectangular" width={40} height={20} />
//                   </TableCell>
//                 )}
//               </TableRow>
//             ))
//           ) : data.length > 0 ? (
//             data.map((item, rowIndex) => (
//               <TableRow
//                 key={rowIndex}
//                 hover
//                 sx={{ cursor: onClick ? "pointer" : "default",padding:1 }}
//                 onClick={(e) => {
//                   if (e.target.type !== "checkbox" && onClick) {
//                     onClick(item);
//                   }
//                 }}
//               >
//                 {check && <TableCell>{check(item, rowIndex)}</TableCell>}
//                 {columns.map((col, colIndex) => (
//                   <TableCell key={colIndex} className={col.className}>
//                     {col.render ? col.render(item, rowIndex) : item[col.field]}
//                   </TableCell>
//                 ))}
//                 {actions && (
//                   <TableCell>{actions ? actions(item, rowIndex) : null}</TableCell>
//                 )}
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell
//                 colSpan={Math.max(
//                   1,
//                   columns.length + (actions ? 1 : 0) + (check ? 1 : 0)
//                 )}
//                 align="center"
//                 sx={{ padding:1, border: "1px solid #d3cccc" }}
//               >
//                 No data found
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default TableComponent;
