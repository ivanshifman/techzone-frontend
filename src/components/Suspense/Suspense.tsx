"use client";

import  { Suspense } from 'react';
import AllProducts from '../../app/products/page';
import Loading from '../shared/Loading';
import TopHead from '../shared/TopHead';


const SuspenseWrapper = () => (
  <Suspense fallback={<Loading />}>
    <TopHead />
    <AllProducts />
  </Suspense>
);

export default SuspenseWrapper;
