import { Box, Typography } from '@mui/material';
import moment from 'moment';
import React, { memo } from 'react'
import { fileFormat } from '../../lib/features';
import renderAttachment from './renderAttachment';
import { grayColor, orange } from '../../Constants/Color';
import  {motion}  from 'framer-motion'

const MessageCOmponent = ({message,user}) => {
    const {sender,content,attachments=[],createdAt}=message;

    const sameSender= sender?._id===user?._id;
    const timeAgo=moment(createdAt).fromNow();

  return (
    <motion.div 
      initial={{opacity:0,x:"-100%"}}
      whileInView={{opacity:1,x:"0"}}
     
    style={{
        alignSelf:sameSender?"flex-end":"flex-start",
        backgroundColor:sameSender?"rgba(0, 0, 0, 0.95)":"rgba(234, 112, 112, 0.95)",
        borderBottomRightRadius:sameSender?"0px":"30px",
        color:sameSender?"white":"white",
        borderTopRightRadius:"30px",
        borderTopLeftRadius:sameSender?"30px":"0px",
        borderBottomLeftRadius:"30px",
        padding:"0.5rem",
        width:"fit-content",
        maxWidth:"85%",
        backdropFilter: "blur(8px)",
        // color={"#2694ab"}
       
    }}
    >
        {
            !sameSender && <Typography color="rgba(0, 0, 0, 0.4)" fontWeight={"600"} variant='caption'>{sender.name} </Typography>
        }
        {
            content && <Typography>{content}</Typography>
        }

        {

            attachments.length >0 && attachments.map((attachment,index)=>{
                  const url=attachment.url
                  const file=fileFormat(url);

                  return <Box key={index}>
                      <a href={url} target='_blank' download style={
                        {
                            color:"black",
                        }
                      }> {renderAttachment(file,url)}</a>
                  </Box>
            })
        }

  <Box
        sx={{
          alignSelf:"flex-end",
          bottom: "-1.5rem",
          right: "0",       
          color: "gray"
        }}
      >
        <Typography variant='caption'>{timeAgo}</Typography>
      </Box>
    </motion.div>
  )
}

export default memo(MessageCOmponent)
