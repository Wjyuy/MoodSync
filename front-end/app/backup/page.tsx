// app/dashboard/page.tsx (서버 컴포넌트)
import ProductForm from '@/components/ProductForm'; // 새로 만든 클라이언트 컴포넌트 임포트

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

async function getProducts(): Promise<Product[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8485';
  
  console.log("Fetching from:", API_BASE_URL);
  try {
    // 백엔드에서 정의한 /api/products 엔드포인트 호출
    const response = await fetch(`${API_BASE_URL}/test/products`);

    if (!response.ok) {
      console.error(`Failed to fetch products: ${response.statusText}`);
      console.log(`response.text():`, await response.text()); // 에러 메시지 출력
      response.text()
      return [];
    }

    const products: Product[] = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function DashboardPage() {
  const products = await getProducts();

  return (
    <div>
      <h1>Products</h1>
      {products.length === 0 ? (
        <p>상품을 찾을 수 없거나 로딩에 실패했습니다.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <h2>{product.name}</h2>
              <p>Price: ${product.price}</p>
              <p>{product.description}</p>
            </li>
          ))}
        </ul>
      )}
      <ProductForm />
    </div>
  );
}