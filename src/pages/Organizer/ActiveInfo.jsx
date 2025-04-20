import { useParams } from "react-router-dom";



function ActiveInfo() {
const { id } = useParams();
  return (
    <div>
        活動資訊:{id}
    </div>
  );
}

export default ActiveInfo;
