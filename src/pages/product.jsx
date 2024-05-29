 import { Detail } from "../components/product_detail/detail";

const Product = ({convertPrice}) => {
  return <Detail convertPrice = {convertPrice} cart={cart} setCart={setCart}/>;
};

export default Product;
