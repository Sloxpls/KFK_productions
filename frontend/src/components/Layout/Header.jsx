import { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar"; 

const Header = () => {
  const [showHeader, setShowHeader] = useState(true);

  // useRef to store the previous scroll position (won't trigger re-renders)
  const lastScrollY = useRef(0);

  // Header is hidden after user scrolls down at least 50px
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
    
    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); 

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        transition: "transform 0.3s ease-in-out",
        transform: showHeader ? "translateY(0)" : "translateY(-100%)",
        zIndex: 1000, 
      }}
    >
      <Navbar />
    </header>
  );
};

export default Header;
