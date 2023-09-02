## Project Overview

A work in progress.

Online community to allow 360 video creators to share their content to the public. 

**Main gallery**
<img width="1465" alt="image" src="https://github.com/ralphr123/vrplatform/assets/29685125/a5be85f5-5b48-49dd-83d2-9287d848e7f4">

**Account page**
<img width="1482" alt="image" src="https://github.com/ralphr123/vrplatform/assets/29685125/7fcbb71b-c713-49f2-aaae-a169c3f344d6">

**My videos**
<img width="1476" alt="image" src="https://github.com/ralphr123/vrplatform/assets/29685125/63067faa-2faf-4387-a1cd-72f5b4a324d3">

**Search bar**
<img width="1506" alt="image" src="https://github.com/ralphr123/vrplatform/assets/29685125/63e8498f-f628-4efa-82f6-bc1c22d17e82">

**Upload videos**
- Videos are uploaded to Azure Blob Storage directly from the client by generating temporary SAS token. 
- Uploading a video triggers a Azure Media Services job to encode the file and generate streaming URLs. 
- Job completion calls a webhook that stores the streaming URLs and updates the video's status in the database. 

<img width="1481" alt="image" src="https://github.com/ralphr123/vrplatform/assets/29685125/82c516c6-ac13-47c0-ab49-949143068232">

**Admin panel: Videos**
<img width="1498" alt="image" src="https://github.com/ralphr123/vrplatform/assets/29685125/0fc58353-a6ea-4758-ab14-7cc2c788806d">

**Admin panel: Users**
<img width="1508" alt="image" src="https://github.com/ralphr123/vrplatform/assets/29685125/bceced22-b585-4818-aebb-ccee009d7aaa">

**Admin panel: Admin users**
<img width="1493" alt="image" src="https://github.com/ralphr123/vrplatform/assets/29685125/10c380ee-725f-4891-88a9-2eaf6f6ba0cc">

