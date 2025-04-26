
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, memo } from 'react';
import Breadcrumb from "../conponents/Breadcrumb";

// 假資料
const sampleData = [
  {
    id: 1,
    imgSrc:"https://fakeimg.pl/350x200/?text=PICTURE",
    title: '台北愛樂《春之頌》交響音樂會',
    showDate:"2024/12/31",
    showTime:"20:00~20:50",
    location:"台北市"
  },
  {
    id: 2,
    imgSrc:"https://fakeimg.pl/350x200/?text=PICTURE",
    title: '台北愛樂《下之頌》交響音樂會',
    showDate:"2024/10/31",
    showTime:"20:00~20:50",
    location:"台北市"
  },
  {
    id: 3,
    imgSrc:"https://fakeimg.pl/350x200/?text=PICTURE",
    title: '台北愛樂《東之頌》交響音樂會',
    showDate:"2024/5/31",
    showTime:"20:00~20:50",
    location:"台北市"
  },
  {
    id: 4,
    imgSrc:"https://fakeimg.pl/350x200/?text=PICTURE",
    title: '台北愛樂《春之頌》交響音樂會',
    showDate:"2024/12/31",
    showTime:"20:00~20:50",
    location:"台北市"
  },
  {
    id: 5,
    imgSrc:"https://fakeimg.pl/350x200/?text=PICTURE",
    title: '台北愛樂《下之頌》交響音樂會',
    showDate:"2024/10/31",
    showTime:"20:00~20:50",
    location:"台北市"
  },
  {
    id: 6,
    imgSrc:"https://fakeimg.pl/350x200/?text=PICTURE",
    title: '台北愛樂《東之頌》交響音樂會',
    showDate:"2024/5/31",
    showTime:"20:00~20:50",
    location:"台北市"
  },
  {
    id: 7,
    imgSrc:"https://fakeimg.pl/350x200/?text=PICTURE",
    title: '台北愛樂《春之頌》交響音樂會',
    showDate:"2024/12/31",
    showTime:"20:00~20:50",
    location:"台北市"
  },
  {
    id: 8,
    imgSrc:"https://fakeimg.pl/350x200/?text=PICTURE",
    title: '台北愛樂《下之頌》交響音樂會',
    showDate:"2024/10/31",
    showTime:"20:00~20:50",
    location:"台北市"
  },
  {
    id: 9,
    imgSrc:"https://fakeimg.pl/350x200/?text=PICTURE",
    title: '台北愛樂《東之頌》交響音樂會',
    showDate:"2024/5/31",
    showTime:"20:00~20:50",
    location:"台北市"
  }
  
];


const CardItem = ({ id, imgSrc, title, showTime, location, handleNavigate }) => (
  <a className="card mb-3" style={{ maxWidth: '540px' }} href="#" onClick={(e) => {
    e.preventDefault();
    handleNavigate(`/evevtInfo/${id}`)
  }}>
    <div className="card" >
      <div className="row g-0">
        <div className="col-md-4">
          <img src={imgSrc} className="img-fluid rounded-start h-100 w-100 object-fit-cover" alt={title} />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{showTime}</p>
            <p className="card-text">{location}</p>
          </div>
        </div>
      </div>
    </div>
  </a>
);

// 製造表格
const DataTable = memo(({handleNavigate}) => {
  return (
    <>
      {sampleData.map((product) => (
        <CardItem
        key={product.id}
        id = {product.id}
        imgSrc = {product.imgSrc}
        title = {product.title}
        showTime = {product.showDate}
        location = {product.location}
        handleNavigate = {handleNavigate}
        />
      ))}
    </>
)
})

const breadcrumb = [
  { name: '首頁', path: "/" },
  { name: '活動列表', path: "/allEvents" },
];



function AllEvents() {
  const navigate = useNavigate();

  const handleNavigate = ((path) => {
    navigate(path)
  }); 
  
  return (
    <>
      <Breadcrumb breadcrumbs = {breadcrumb}></Breadcrumb>

      {/* 產生活動列表 */}
      <DataTable handleNavigate={handleNavigate}></DataTable>

      
    </>
    
  );
}

export default AllEvents;
