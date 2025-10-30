
import BrandCategorySection from './components/user/BrandCategorySection';
import ProductCategory from './components/user/ProductCategory';
import PartnerLogoBanner from './components/user/PartnerLogoBanner';
// import Products from './components/user/Products';

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


export default function HomePage() {
    return (
        <div>
            <div>
                <Navbar />
            </div>
         <div> 
          <ProductCategory />
         </div>
         <div className='p-6'>
         <BrandCategorySection />
         </div>
         <div>
            <PartnerLogoBanner />
         </div>
        {/* <div className='p-6'> 
            <Products />
        </div> */}
        <div>
            <Footer />
        </div>

        </div>
    )
}