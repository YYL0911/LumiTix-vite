import { useParams } from "react-router-dom";



function EventInfo() {
const { id } = useParams();
  return (
    <div>
        活動內容頁，活動id:{id}
    </div>
  );
}

export default EventInfo;
