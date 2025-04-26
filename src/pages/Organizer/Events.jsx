
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, memo } from 'react';
import Breadcrumb from "../../conponents/Breadcrumb";

// 假資料
const sampleData = [
  {
    id: 1,
    title: '台北愛樂《春之頌》交響音樂會',
    showDate:"2024/12/31",
    showTime:"20:00~20:50",
    total:"70/220",
    activeState:"Ing"
  },
  {
    id: 2,
    title: '台北愛樂《下之頌》交響音樂會',
    showDate:"2024/10/31",
    showTime:"20:00~20:50",
    total:"78/250",
    activeState:"Ing"
  },
  {
    id: 3,
    title: '台北愛樂《東之頌》交響音樂會',
    showDate:"2024/5/31",
    showTime:"20:00~20:50",
    total:"70/220",
    activeState:"Ing"
  },
  {
    id: 4,
    title: '交響音樂會',
    showDate:"2024/12/31",
    showTime:"20:00~20:50",
    total:"70/220",
    activeState:"Finish"
  },
  {
    id: 5,
    title: '台北愛樂《下之頌》',
    showDate:"2024/10/31",
    showTime:"20:00~20:50",
    total:"78/250",
    activeState:"Finish"
  },
  {
    id: 6,
    title: '台交響音樂會',
    showDate:"2024/5/31",
    showTime:"20:00~20:50",
    total:"70/220",
    activeState:"Check"
  },
  
];

// 製造表格
const DataTable = memo(({filterProducts, handleNavigate}) => {
  return (
    <div className="table-responsive">
    <table className="table table-striped text-center align-middle">
      <colgroup>
        <col style={{ minWidth: '150px'}} />
        <col style={{ minWidth: '120px'}} />
        <col style={{ minWidth: '120px'}} />
        <col style={{ minWidth: '220px'}} />
      </colgroup>
      <thead>
        <tr>
          <th scope="col" className="text-wrap text-break">活動名稱</th>
          <th scope="col" className="text-wrap text-break">表演時段</th>
          <th scope="col" className="text-wrap text-break">購票人數</th>
          <th scope="col" className="text-wrap text-break">操作</th>
        </tr>
      </thead>
      <tbody>
        {filterProducts.map((product) => (
          <tr key={product.id}>
            <td className="text-wrap text-break">{product.title}</td>
            <td className="text-wrap text-break">
              {product.showDate}<br />{product.showTime}
            </td>
            <td>{product.total}</td>
            <td>
              <button
                type="button"
                className="btn btn-dark mx-1 "
                onClick={() => handleNavigate(`/activeInfo/${product.id}`)}
              >
                編輯資訊
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary mx-1"
                onClick={() => handleNavigate(`/activeInfo/${product.id}`)}
              >
                詳細內容
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>   
)
})

const breadcrumb = [
  { name: '首頁', path: "/" },
  { name: '活動訂單', path: "/events" },
];

function Events() {

  

  const navigate = useNavigate();
  const [activeState, setActiveState] = useState("Ing"); //Ing Finish Check

  const filterProducts = useMemo(() => {
    return [...sampleData]
      .filter((product) => {
        return product.activeState.match(activeState);
      });
  }, [activeState]);

  const handleNavigate = ((path) => {
    navigate(path)
  }); 

  return (
    <>
      <Breadcrumb breadcrumbs = {breadcrumb}></Breadcrumb>

      {/* 新增活動 */}
      <button type=' button' className='btn btn-danger btn-lg my-3' >
        新增活動
      </button>

      {/* 活動狀態 */}
      <div className=' my-3'>
        <input type="radio" className="btn-check" name="activeState" id="option1" 
        autoComplete="off" defaultChecked = {'checked'} 
        onClick={() => setActiveState("Ing")} />
        <label className="btn btn-light mx-lg-3 mx-2" htmlFor="option1">正在舉辦</label>

        <input type="radio" className="btn-check" name="activeState" id="option2"
         autoComplete="off" 
         onClick={() => setActiveState("Finish")} />
        <label className="btn btn-light mx-lg-3 mx-2" htmlFor="option2">已經結束</label>

        <input type="radio" className="btn-check" name="activeState" id="option3" 
        autoComplete="off" 
        onClick={() => setActiveState("Check")} />
        <label className="btn btn-light mx-lg-3 mx-2" htmlFor="option3">正在審核</label>
      </div>
      

      {/* 根據狀態產生活動列表 */}
      <DataTable filterProducts={filterProducts} handleNavigate={handleNavigate}></DataTable>
    </>
    
  );
}

export default Events;
