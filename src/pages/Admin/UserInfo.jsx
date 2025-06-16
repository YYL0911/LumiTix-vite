import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
// 元件
import Breadcrumb from "../../conponents/Breadcrumb";
import Loading from "../../conponents/Loading";
import PaginationComponent from "../../conponents/Pagination";

// 定義此頁面的麵包屑靜態結構
const breadcrumb = [{ name: "首頁", path: "/" }, { name: "一般會員列表", path: "/userList" }, { name: "會員詳情" }];

const UserInfo = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { userToken } = useAuth();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);

  // --- 新增分頁相關的 State ---
  const [pagedOrders, setPagedOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10; // 可以自行調整每頁顯示幾筆訂單

  // --- 新增處理分頁邏輯的 useEffect ---
  useEffect(() => {
    if (orders && orders.length > 0) {
      const total = Math.ceil(orders.length / ordersPerPage);
      setTotalPages(total > 0 ? total : 1);

      const startIndex = (currentPage - 1) * ordersPerPage;
      const endIndex = startIndex + ordersPerPage;
      setPagedOrders(orders.slice(startIndex, endIndex));

      // 如果因資料變動導致當前頁不存在，則跳回第一頁
      if (currentPage > total && total > 0) {
        setCurrentPage(1);
      }
    } else {
      // 如果沒有訂單，重設分頁
      setPagedOrders([]);
      setTotalPages(1);
      setCurrentPage(1);
    }
  }, [orders, currentPage, ordersPerPage]);

  // 讀取會員資料
  useEffect(() => {
    if (!userId || !userToken) return;

    const fetchUserData = async () => {
      setApiLoading(true);
      try {
        const url = `https://n7-backend.onrender.com/api/v1/admin/users/${userId}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (response.data.status) {
          setUser(response.data.data.user);
          setOrders(response.data.data.orders);
        } else {
          throw new Error(response.data.message || "無法取得使用者資料");
        }
      } catch (error) {
        console.error("獲取會員資料失敗", error);
        alert("獲取會員資料失敗，將返回列表頁。");
        navigate("/userList");
      } finally {
        setApiLoading(false);
      }
    };

    fetchUserData();
  }, [userId, userToken, navigate]);

  // 切換封鎖狀態的函式
  const handleBlockUser = async () => {
    // 根據目前狀態，決定提示訊息的動詞
    const actionText = user.isBlocked ? "取消封鎖" : "封鎖";

    const result = await Swal.fire({
      title: `確定要 ${actionText} 使用者 ${user.name} 嗎？`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: `是的，${actionText}`,
      cancelButtonText: "取消",
    });

    if (result.isConfirmed) {
      setApiLoading(true);
      try {
        const url = `https://n7-backend.onrender.com/api/v1/admin/users/${userId}/toggle-block`;
        const response = await axios.patch(url, {}, { headers: { Authorization: `Bearer ${userToken}` } });

        if (response.data.status) {
          Swal.fire({
            title: "操作成功！",
            text: `已成功 ${actionText} 使用者。`,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          setUser((prevUser) => ({ ...prevUser, isBlocked: response.data.data.isBlocked }));
        } else {
          throw new Error(response.data.message || "操作失敗");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || "發生未知錯誤，請稍後再試。";
        Swal.fire("操作失敗！", errorMessage, "error");
      } finally {
        setApiLoading(false);
      }
    }
  };

  if (apiLoading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="container py-3">
        <Breadcrumb breadcrumbs={breadcrumb} />
        <div className="alert alert-warning text-center mt-4">查無此會員資料。</div>
        <div className="text-center">
          <button className="btn btn-primary" onClick={() => navigate("/userList")}>
            返回列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-3 px-md-5">
      <Breadcrumb breadcrumbs={breadcrumb} />

      <div className="my-4 p-3 border rounded bg-light">
        <p>
          <strong>會員編號：</strong> {user.id}
        </p>
        <p>
          <strong>姓名：</strong> {user.name}
        </p>
        <p>
          <strong>Email(帳號)：</strong> {user.email}
        </p>
        <p className="mb-0">
          <strong>狀態：</strong>
          <span className={`badge ${user.isBlocked ? "bg-danger" : "bg-success"}`}>
            {user.isBlocked ? "已封鎖" : "正常"}
          </span>
        </p>
      </div>

      <h4 className="mt-5">購票紀錄</h4>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light text-center">
            <tr>
              <th className="text-start">表演名稱</th>
              <th>購買張數</th>
              <th>購買總金額</th>
              <th>已使用張數</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {pagedOrders.length > 0 ? (
              pagedOrders.map((order) => (
                <tr key={order.order_id}>
                  <td className="text-start">{order.event_title}</td>
                  <td>{order.ticket_puchased}</td>
                  <td className="text-end">{(order.total_price ?? 0).toLocaleString()}</td>
                  <td className="text-end">{order.ticket_used}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  無購票紀錄
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- 在表格下方加入分頁元件 --- */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      <div className="mt-5 d-flex justify-content-center gap-3">
        <button className="btn btn-primary px-4" onClick={() => navigate("/userList")}>
          返回
        </button>
        <button className={`btn px-4 ${user.isBlocked ? "btn-success" : "btn-danger"}`} onClick={handleBlockUser}>
          {user.isBlocked ? "取消封鎖" : "封鎖"}
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
