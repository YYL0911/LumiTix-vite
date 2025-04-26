import { useLocation } from "react-router-dom";

function TicketScanerResult() {
  const location = useLocation();
  const { result } = location.state || {};  // 要加 || {} 防止錯誤

  return (
    <div>
      {result.toString()}
    </div>
  );
}

export default TicketScanerResult;
