import { FaSearch } from "react-icons/fa";
import React from "react";

export default function SearchIcon({ className, ...props }) {
  return <FaSearch className={className} style={{ color: '#F3AD04', marginTop: '-22px', marginLeft: '28px' }} size={20} {...props} />;
}
