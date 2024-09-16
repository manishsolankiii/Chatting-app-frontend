import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { Avatar, Box, Skeleton, Stack } from "@mui/material";
import { dashboardData } from "../../Constants/SampleData";
import { fileFormat, transformImage } from "../../lib/features";
import moment from "moment";
import Table from "../../components/Shared/Table";
import { roRO } from "@mui/material/locale";
import  RenderAttachment from "../../components/Shared/renderAttachment"
import { useFetchData } from "6pp";
import { server } from "../../Constants/config";
import { useErrors } from "../../hooks/hook";
const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {

    
      const {attachments} =params.row;
return attachments?.length>0?  attachments.map((i)=> {
  const url=i.url;
  const file=fileFormat(url);
    return <Box key={i}>
        <a href={url}download target="_blank" style={{
          color:"black",
        }}> 
          {RenderAttachment(file,url)}
        </a>
    </Box>
    })
      
  :"No Attchments"

     
    },
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },
  {
    field: "sender",
    headerName: "Send By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
        <span>{params.row.sender.name}</span>
      </Stack>
    ),
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
  },
];
const MessageManagment = () => {

  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/messages`,
    "dashboard-messages"
  );

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data) {
      setRows(
        data.messages.map((i) => ({
          ...i,
          id: i._id,
          sender: {
            name: i.sender.name,
            avatar: transformImage(i.sender.avatar, 50),
          },
          createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
        }))
      );
    }
  }, [data]);
  return (
    <AdminLayout> 
       {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Table
          heading={"All Messages"}
          columns={columns}
          rows={rows}
          rowHeight={200}
        />
      )}
    </AdminLayout>
  );
};

export default MessageManagment;
