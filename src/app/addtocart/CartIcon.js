import { FaShoppingCart } from "react-icons/fa";
import React from "react";

export default function CartIcon({ className, ...props }) {
  return <FaShoppingCart className={className} style={{ color: '#fff' }} size={32} {...props} />;
}
