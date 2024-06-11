import React from 'react'
import './Attachment.css';

function Attachment({ attachment }) {
  return (
    <div>
      {(attachment.fileType === 'image')
        ?
        <div>
          <img src={attachment.fileUrl} alt="Attachment Image" id='attachment-image'/>
        </div>
        :
        (attachment.fileType === 'audio'
          ?
          <audio controls>
            <source src={attachment.fileUrl} type="audio/mpeg" />
          </audio>
          :
          (attachment.fileType === 'video'
            ?
            <video width="320" height="240" controls id='attachment-video'>
              <source src={attachment.fileUrl} type="video/mp4" />
            </video>
            :
           <a href={attachment.fileUrl}>Download pdf</a>
          )
        )
      }
    </div >
  )
}

export default Attachment;