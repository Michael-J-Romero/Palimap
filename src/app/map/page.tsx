// Placeholder for page.tsx

'use client';
import Map from '@/components/map';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LocationModal from '@/components/Location'; // Your modal
import {settings as allSettings} from '@/data/builtIn'
const settings=allSettings
export default function MapPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  let slug = searchParams.get('location');
  let type = "location"
  if(!slug) {
    slug = searchParams.get('apn');
    type = "apn"
  }
  async function getParcelData(apn) {
    let parcelUrl=`https://public.gis.lacounty.gov/public/rest/services/LACounty_Cache/LACounty_Parcel/MapServer/0/query?where=APN='${apn}'&outFields=*&f=geojson`
    let response = await fetch(parcelUrl);
    let data = await response.json();
    console.log("data2",data)
    return data;
  }
  getParcelData(slug)
  async function getFireData() {
  }
  const pageData = {slug,type,getParcelData}
  const [showModal, setShowModal] = useState(false);

  // Modal open state based on presence of query param
  useEffect(() => {
    if (slug) {
      console.log(type,slug,"here2")
      setShowModal(true);

      // Optional: redirect to canonical page if user loads with query param directly
      if (performance?.navigation?.type === 1) {
        // type === 1 means full reload
        // router.replace(`/location/${slug}`);
      }
    } else {
      setShowModal(false);
    }
  }, [slug, router]);

  // const openLocation = (slug: string) => {
  //   router.push(`/map?location=${slug}`, undefined, { shallow: true });
  //   setOpen(true);
  // };
console.log('slug', slug,showModal)
  return (
    <>
      {/* Your actual map would go here */}
      {false && showModal && slug && (
        <div    style={{ 
            zIndex: settings.zIndex.map,
            height: '100%',
            width: '100%',
            // position: 'fixed',
            // overflow: 'auto',
            background: '#eee',
            // position: fixed;
            // z-index: 9999;
            // height: 100%;
            // width: 100%;
        }}>
        {type === "apn" ? <h1>APN</h1> 
        :<div>
          {type}
          <h1>{slug}</h1>
        </div>
        // <LocationModal
        //   slug={slug}
        //   onClose={() => {
        //     router.push('/map', undefined, { shallow: true }); // Remove query param
        //   }}
        // />
    }
        </div>
      )}
      <Map 
      // openLocation={openLocation} showModal={showModal} slug={slug} 
      {...{
        // openLocation,
        setShowModal,
        showModal,
        pageData,//open, setOpen
        
      }}
      />

    </>
  );
}
