import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import top from "../assets/img/Top.png"

function Top() {
  const [showButton, setShowButton] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    // 每次路由變更時捲動到最上方
    window.scrollTo(0, 0);
  }, [pathname]);

  // 監聽滾動事件
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // 清除事件監聽
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* 回到最上面按鈕 */}
      {showButton && (
        <button
          className="btn image-btn position-fixed shadow"
          style={{
            bottom: '20px',
            right: '20px',
            width: '52px',
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={scrollToTop}
          aria-label="回到最上面"
        >
          <img src={top} alt="按鈕" />
          
        </button>
      )}
    </>
  );
}

export default Top;