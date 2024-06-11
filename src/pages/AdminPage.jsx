import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import styles from './adminPage.module.css';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', provider: '', image: '' });
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
    };

    const fetchProviders = async () => {
      const providersCollection = collection(db, 'providers');
      const providerSnapshot = await getDocs(providersCollection);
      const providerList = providerSnapshot.docs.map(doc => doc.data().category);
      setProviders(providerList);
    };

    fetchProducts();
    fetchProviders();
  }, []);

  const handleAddProduct = async () => {
    try {
      const newProductWithTimestamp = {
        ...newProduct,
        createdAt: serverTimestamp() // createdAt 필드를 추가
      };
      const docRef = await addDoc(collection(db, 'products'), newProductWithTimestamp);
      setProducts([...products, { id: docRef.id, ...newProductWithTimestamp }]);
      setNewProduct({ name: '', price: '', provider: '', image: '' });
    } catch (error) {
      console.error('Error adding product: ', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product: ', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = async () => {
    try {
      await updateDoc(doc(db, 'products', editingProduct.id), editingProduct);
      setProducts(products.map(product => (product.id === editingProduct.id ? editingProduct : product)));
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product: ', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.adminContainer}>
      <h2>관리자 페이지</h2>

      <div className={styles.addProduct}>
        <h3>상품 등록</h3>
        <input
          type="text"
          placeholder="상품명"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="가격"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <select value={newProduct.provider} onChange={(e) => setNewProduct({ ...newProduct, provider: e.target.value })}>
          <option value="">카테고리 선택</option>
          {providers.map(provider => (
            <option key={provider} value={provider}>{provider}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="이미지 URL"
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
        />
        <button onClick={handleAddProduct}>상품 추가</button>
      </div>

      <div className={styles.searchProduct}>
        <h3>상품 검색</h3>
        <input
          type="text"
          placeholder="상품명 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.productList}>
        <h3>등록된 상품 목록</h3>
        <ul>
          {filteredProducts.map(product => (
            <li key={product.id}>
              <span>{product.name} - {product.price}원</span>
              <button onClick={() => handleEditProduct(product)}>수정</button>
              <button onClick={() => handleDeleteProduct(product.id)}>삭제</button>
            </li>
          ))}
        </ul>
      </div>

      {editingProduct && (
        <div className={styles.editProduct}>
          <h3>상품 수정</h3>
          <input
            type="text"
            placeholder="상품명"
            value={editingProduct.name}
            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="가격"
            value={editingProduct.price}
            onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
          />
          <select value={editingProduct.provider} onChange={(e) => setEditingProduct({ ...editingProduct, provider: e.target.value })}>
            <option value="">카테고리 선택</option>
            {providers.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="이미지 URL"
            value={editingProduct.image}
            onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
          />
          <button onClick={handleUpdateProduct}>상품 수정</button>
          <button onClick={() => setEditingProduct(null)}>취소</button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
