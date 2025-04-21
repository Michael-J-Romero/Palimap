import dynamic from "next/dynamic";

const SplitMap = dynamic(() => import("../../components/fireMap.js"), { ssr: false });

export default function Home() {
  return <SplitMap />;
}
